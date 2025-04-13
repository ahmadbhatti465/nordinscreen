const { DevicesStatusRepository, DevicesRepository } = require('../database/');
const { PublishMessage, PublishMessageToSchedules } = require('../utils');
const { NotFoundError, ValidationError } = require('../utils/errors/app-errors');
const axios = require('axios');


class DevicesService {
    constructor() {
        this.devicesRepository = new DevicesRepository();
        this.devicesStatusRepository = new DevicesStatusRepository();
    }

    async SubscribeEvents(data, MQChannel = null) {
        console.log("SubscribeEvents()")
        //
        try {
            let parsedData = JSON.parse(data);
            let type = parsedData.type;
            switch (type) {
                case "status":
                    await this.status(parsedData.data);
                    break;
                case "bulk_status":
                    await this.bulk_status(parsedData.data);
                    break;
                case "control":
                    await this.control(parsedData.data, parsedData.status, MQChannel, parsedData.scheduleId, parsedData.controlChannel, parsedData.requeue >= 0 ? parsedData.requeue : 0);
                    break;
                case "bulk_control":
                    await this.bulk_control(parsedData.data, parsedData.status, MQChannel);
                    break;
                default:
                    console.log("Unknown event type: " + type);
                    break;
            }


        } catch (error) {
            console.log(error);
        }

    }

    async status(device) {
        let that = this;
        console.log("status()");

        const postData = 'id=' + device.code + '&auth_key=' + device.apiKey;
        console.log(postData)

        await axios.post(device.shellyUrl + '/device/status', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(async (response) => {
                //console.log('Response:', response.data.data);
                let isOnline = response.data.data.online;
                let responseData = response.data.data.device_status;

                console.log("status() - done");

                console.log("=========== Device - Status ================");
                let deviceStatus = {};
                try {

                    if (isOnline == false) { throw new Error("Device is offline"); }

                    deviceStatus.deviceId = device._id;
                    deviceStatus.userId = device.userId;
                    deviceStatus.totalPowerConsumption = responseData['switch:0']['aenergy'].total;
                    deviceStatus.powerConsumption = responseData['switch:0']['apower'] >= 0 ? responseData['switch:0']['apower'] : 0;
                    deviceStatus.powerUsage = responseData['switch:0']['apower'] >= 0 ? responseData['switch:0']['apower'] : 0;
                    deviceStatus.voltage = responseData['switch:0']['voltage'];
                    deviceStatus.current = responseData['switch:0']['current'];
                    deviceStatus.isTurnedOn = responseData['switch:0']['output'];
                    deviceStatus.isOnline = true;

                    if (device.channels > 1) {
                        for (let i = 1; i < device.channels; i++) {
                            deviceStatus.powerConsumption += responseData['switch:' + i]['apower'] >= 0 ? responseData['switch:' + i]['apower'] : 0;
                            deviceStatus.totalPowerConsumption += responseData['switch:' + i]['aenergy'].total;
                            deviceStatus.powerUsage += responseData['switch:' + i]['apower'] >= 0 ? responseData['switch:' + i]['apower'] : 0;
                            deviceStatus.current += responseData['switch:' + i]['current'];
                            deviceStatus.isTurnedOn = deviceStatus.isTurnedOn || responseData['switch:' + i]['output'];
                        }
                    }



                    await that.devicesStatusRepository.create(deviceStatus.userId, deviceStatus.deviceId, deviceStatus.isTurnedOn, deviceStatus.totalPowerConsumption, deviceStatus.powerConsumption, deviceStatus.powerUsage, deviceStatus.voltage, deviceStatus.current);
                    await that.devicesRepository.updateDevice({ id: deviceStatus.deviceId, userId: deviceStatus.userId, isTurnedOn: deviceStatus.isTurnedOn, totalPowerConsumption: deviceStatus.totalPowerConsumption, currentPowerUsage: deviceStatus.powerConsumption, currentVoltage: deviceStatus.voltage, currentCurrent: deviceStatus.current, isOnline: deviceStatus.isOnline });
                } catch (error) {
                    console.error(error);
                    await that.devicesRepository.updateDevice({ id: device._id, userId: device.userId, isOnline: false });
                }

            })
            .catch(error => {
                console.error('Error:', error.response.data);
                //console.log(error.response.data);

            });
    }
    async bulk_status(devicesGroup) {
        let that = this
        let devicesCodeArr = [];
        for (const device of devicesGroup) {
            //device contains apiKey, code, id, name, type, userId
            devicesCodeArr.push(device.code.toLowerCase());
        }


        //get apikey
        const apiKey = devicesGroup[0].apiKey;
        const shellyUrl = devicesGroup[0].shellyUrl

        const postData = `devices=${JSON.stringify(devicesCodeArr)}&auth_key=${apiKey}`


        //const postData = 'devices=["E465B8B0D8E0","E465B86090E8"]&auth_key=MjI1Yjc5dWlk486AFD50C88E5CF4E108FAA980ADBCE2CF4006B8C2C2E0F543216DB8059F867A513B0A70333BD12905DD8'


        await axios.post(shellyUrl + '/device/bulk_status', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(async (response) => {

                let devices = response.data.data.devices_status;

                for (const deviceCode in devices) {
                    console.log("=========== Device ================");
                    let deviceStatus = {};
                    try {

                        let deviceId = '';
                        let userId = '';
                        let channels = 1;
                        for (const groupDevice of devicesGroup) {
                            if (groupDevice.code === deviceCode.toLowerCase()) {
                                deviceId = groupDevice._id;
                                userId = groupDevice.userId;
                                channels = groupDevice.channels
                                break;
                            }
                        }

                        //remove deviceCode from devicesCodeArr
                        devicesCodeArr.splice(devicesCodeArr.indexOf(deviceCode), 1);

                        deviceStatus.deviceId = deviceId;
                        deviceStatus.userId = userId;
                        deviceStatus.totalPowerConsumption = devices[deviceCode]['switch:0']['aenergy'].total;
                        deviceStatus.powerConsumption = devices[deviceCode]['switch:0']['apower'] >= 0 ? devices[deviceCode]['switch:0']['apower'] : 0;
                        deviceStatus.powerUsage = devices[deviceCode]['switch:0']['apower'] >= 0 ? devices[deviceCode]['switch:0']['apower'] : 0;
                        deviceStatus.voltage = devices[deviceCode]['switch:0']['voltage'];
                        deviceStatus.current = devices[deviceCode]['switch:0']['current'];
                        deviceStatus.isTurnedOn = devices[deviceCode]['switch:0']['output'];
                        deviceStatus.isOnline = true



                        if (channels > 1) {
                            try {
                                for (let i = 1; i < channels; i++) {
                                    deviceStatus.powerConsumption += devices[deviceCode]['switch:' + i]['apower'] >= 0 ? devices[deviceCode]['switch:' + i]['apower'] : 0;
                                    deviceStatus.totalPowerConsumption += devices[deviceCode]['switch:' + i]['aenergy'].total;
                                    deviceStatus.powerUsage += devices[deviceCode]['switch:' + i]['apower'] >= 0 ? devices[deviceCode]['switch:' + i]['apower'] : 0;
                                    deviceStatus.current += devices[deviceCode]['switch:' + i]['current'];
                                    deviceStatus.isTurnedOn = deviceStatus.isTurnedOn || devices[deviceCode]['switch:' + i]['output'];
                                }
                            } catch (error) {
                                console.error("Error: ", error);
                            }
                        }



                        await that.devicesStatusRepository.create(userId, deviceId, deviceStatus.isTurnedOn, deviceStatus.totalPowerConsumption, deviceStatus.powerConsumption, deviceStatus.powerUsage, deviceStatus.voltage, deviceStatus.current);
                        await that.devicesRepository.updateDevice({ id: deviceStatus.deviceId, userId: deviceStatus.userId, isTurnedOn: deviceStatus.isTurnedOn, totalPowerConsumption: deviceStatus.totalPowerConsumption, currentPowerUsage: deviceStatus.powerConsumption, currentVoltage: deviceStatus.voltage, currentCurrent: deviceStatus.current, isOnline: deviceStatus.isOnline });
                    } catch (error) {
                        console.error(error);
                    }
                }

                //with leftover devices in devicesCodeArr update db with isOnline = false
                for (const deviceCode of devicesCodeArr) {
                    let deviceId = '';
                    let userId = '';
                    let channels = 1;
                    for (const groupDevice of devicesGroup) {
                        if (groupDevice.code === deviceCode.toLowerCase()) {
                            deviceId = groupDevice._id;
                            userId = groupDevice.userId;
                            channels = groupDevice.channels
                            break;
                        }
                    }

                    await that.devicesRepository.updateDevice({ id: deviceId, userId: userId, isOnline: false, isTurnedOn: false });
                }

            })
            .catch(error => {
                console.error('Error:', error.response.data);
                //console.log(error.response.data);

            });
    }

    /**
     * 
     * @param {*} device 
     * @param {Boolean} status True = Turn On, False = Turn Off
     */
    async control(device, status, MQChannel, scheduleId, controlChannel, requeue = 0) {
        let that = this;

        if (scheduleId) {
            PublishMessageToSchedules(MQChannel, JSON.stringify({ "device": device, "status": status, "state": "processing", scheduleId: scheduleId }));
        }

        const logWithTimestamp = (message) => {
            console.log(`[${new Date().toISOString()}] ${message}`);
        };

        logWithTimestamp("control()");

        if (device.channels > 1 && status == false) {
            // Call bulk_control
            await that.bulk_control([device], status, MQChannel, scheduleId, requeue);
            return;
        } else if (device.channels > 1 && status == true && (controlChannel == undefined || controlChannel == null)) {
            // Call delayed_control
            console.log("sending over to delayed_control()");
            await that.delayed_control(device, MQChannel, scheduleId);
            return;
        }

        const postData = 'channel=' + (controlChannel ? controlChannel : '0') + '&turn=' + (status ? 'on' : 'off') + '&id=' + device.code + '&auth_key=' + device.apiKey;
        logWithTimestamp(postData);

        try {
            //throw "Lets requeue control()";
            const response = await axios.post(device.shellyUrl + '/device/relay/control', postData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            logWithTimestamp('Response: ' + JSON.stringify(response.data.data));

            logWithTimestamp("control() - done");

            if (scheduleId && controlChannel >= 0) {
                let last_channel = device.channels - 1;
                if (controlChannel < last_channel) {
                    PublishMessageToSchedules(MQChannel, JSON.stringify({ "device": device, "status": status, "state": "processing", scheduleId: scheduleId, message: "Channel: " + controlChannel }));
                } else {
                    PublishMessageToSchedules(MQChannel, JSON.stringify({ "device": device, "status": status, "state": "completed", scheduleId: scheduleId }));
                }

            } else if (scheduleId) {
                PublishMessageToSchedules(MQChannel, JSON.stringify({ "device": device, "status": status, "state": "completed", scheduleId: scheduleId }));
            }

            // Update last status with isTurnedOn
            let updateData = {
                id: device._id,
                isTurnedOn: status,
                userId: device.userId
            };
            if (!status) {
                updateData.currentPowerUsage = 0;
                updateData.currentVoltage = 0;
                updateData.currentCurrent = 0;
            }
            await that.devicesRepository.updateDevice(updateData);

            // We controlled the device so we need to fetch new status
            let data = {
                type: "status",
                data: device
            };
            // Wait 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
            PublishMessage(MQChannel, JSON.stringify(data));
        } catch (error) {
            logWithTimestamp('Error: ' + error.response.data);

            /* if (scheduleId) {
                PublishMessageToSchedules(MQChannel, JSON.stringify({ "device": device, "status": status, "state": "error", "error": error }));
            } else if(requeue <= 1) {
                console.log("Catch: Lets requeue()");
                that.requeue(device, status, MQChannel, controlChannel, requeue);
            } */

            if (error.response && error.response.data && error.response.data.isok == false && error.response.data.errors.max_req ) {
                logWithTimestamp('Error: ' + error.response.data.errors.max_req);

                //that.requeue(device, status, MQChannel, scheduleId, requeue, 'bulk_control');
                that.requeue({ device: device, status, MQChannel, scheduleId: null, controlChannel: controlChannel, requeue, type: 'control' });
            }

            // Handle the error appropriately
        }
    }

    async bulk_control(devices, status, MQChannel, scheduleId, requeue = 0) {
        let that = this;
        console.log("bulk_control()");
        let devicesCodeArr = [];
        for (const device of devices) {
            //device contains apiKey, code, id, name, type, userId
            devicesCodeArr.push({ "id": device.code.toUpperCase(), "channel": "0" });
            if (device.channels > 1) {
                for (let i = 1; i < device.channels; i++) {
                    devicesCodeArr.push({ "id": device.code.toUpperCase(), "channel": i.toString() });
                }
            }
        }

        const apiKey = devices[0].apiKey;
        const shellyUrl = devices[0].shellyUrl;

        //const postData = 'devices=[{"id":"E465B8B0D8E0","channel":"0"},{"id":"E465B86090E8","channel":"0"}]&turn=off&auth_key=MjI1Yjc5dWlk486AFD50C88E5CF4E108FAA980ADBCE2CF4006B8C2C2E0F6DB8059F867A513B0A70333BD12905DD8'
        const postData = 'devices=' + JSON.stringify(devicesCodeArr) + '&turn=' + (status ? 'on' : 'off') + '&auth_key=' + apiKey;
        console.log(postData)

        await axios.post(shellyUrl + '/device/relay/bulk_control', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(async (response) => {
                console.log('Response:', response.data.data);
                //console.log(response.data.data);

                console.log("bulk_control() - done");


                for (const device of devices) {
                    //device contains apiKey, code, id, name, type, userId
                    let updateData = {
                        id: device._id,
                        isTurnedOn: status,
                        userId: device.userId
                    }
                    if (!status) {
                        updateData.currentPowerUsage = 0;
                        updateData.currentVoltage = 0;
                        updateData.currentCurrent = 0;
                    }
                    await that.devicesRepository.updateDevice(updateData);
                }

                if (scheduleId) {
                    PublishMessageToSchedules(MQChannel, JSON.stringify({ "device": device, "status": status, "state": "completed", scheduleId: scheduleId }));
                }

            })
            .catch(error => {
                console.error('Error:', error.response.data);
                /* if (scheduleId) {
                    PublishMessageToSchedules(MQChannel, JSON.stringify({ "device": device, "status": status, "state": "error", "error": error }));
                } */
                if (error.response && error.response.data && error.response.data.isok == false && error.response.data.errors.max_req ) {
                    console.error('Error: ' + error.response.data.errors.max_req);
                    that.requeue({ device: devices, status, MQChannel, scheduleId: null, controlChannel: null, requeue, type: 'bulk_control' });
                }
                //console.log(error.response.data);

            });
    }

    /**
     * This function is for multichannel devices
     * purpose: to turn ON multichannel devices with delay between each channel
     */
    async delayed_control(device, MQChannel, scheduleId) {
        console.log("delayed_control()");
        console.log(device);

        if (device.channels <= 1) return;


        try {
            let delay = 0;
            for (let i = 0; i < device.channels; i++) {
                delay += device.channelsDelays[i] ? device.channelsDelays[i].delay : 0;
                setTimeout(() => {
                    let data = {
                        type: "control",
                        data: device,
                        controlChannel: i,
                        status: true,
                        scheduleId: scheduleId
                    };

                    PublishMessage(MQChannel, JSON.stringify(data));
                }, 1000 * delay);


            }
        }
        catch (error) {
            console.log(error);
        }

    }

    /**
     * Error 401 - Unauthorized comes when the api rejects the request if multiple requests are made under 1 second to Shelly API
     * Solution: We send the request again after 5 second to queue
     * 
     */
    async requeue(input) {
        let { device, status, MQChannel, scheduleId, controlChannel, type, requeue = 0 } = input;
        console.log("requeue()");
        console.log(device);
        setTimeout(() => {
            let data = {
                type: type,
                data: device,
                status: status,
                controlChannel: controlChannel,
                requeue: requeue++
            };
            PublishMessage(MQChannel, JSON.stringify(data));
        }, 5e3);

    }
}

module.exports = DevicesService