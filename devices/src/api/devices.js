const DevicesService = require('../services/devices-service');
const DevicesStatusService = require('../services/devices-status-service');
const GroupsService = require('../services/groups-service');
const EnergyService = require('../services/energy-service');

const UserAuth = require('./middlewares/auth');
const { SubscribeMessage, PublishMessage } = require('../utils');
const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors/app-errors');
const { APP_SECRET, STATUS_INTERVAL } = require('../config');

module.exports = (app, channel) => {
    const service = new DevicesService();
    const statusService = new DevicesStatusService();
    const groupsService = new GroupsService();
    const energyService = new EnergyService();

    //To listen
    //SubscribeMessage(channel, service);

    app.get('/devices/:id?', UserAuth, async (req, res, next) => {
        try {
            //console.log("getting device")
            //console.log("query", req.query, req.user)
            const { id } = req.query
            let userId = req.user._id;
            //userId = req.user.type == 'admin' && req.query.userId != 'null' ? req.query.userId : userId;

            if (id) {
                const device = await service.getDevice(id, userId);
                if (!device) throw new ValidationError("Device not found");
                return res.json(device);
            } else {
                //console.log("getting all devices")
                const pageNumber = req.query.pageNumber || 1;
                const pageSize = req.query.pageSize || 1000;

                const fields = req.query.fields ? req.query.fields.split(",") : [];

                const { devices, pagination } = await service.getDevices({ userId, pageNumber: pageNumber * 1, pageSize: pageSize * 1, fields });

                let powerSavingLast24Hours = null;
                if (devices.length > 0) {
                    //const powerSavingLast24Hours = await statusService.getPowerSavingLast24Hours({ userId });
                    let devicesIds = devices.map(device => device._id.toString());
                    powerSavingLast24Hours = await energyService.getPowerSavingLast24Hours({ userId, devicesIds });
                }

                //console.log(devices.length)

                return res.json({ devices, pagination, powerSavingLast24Hours });
            }
        } catch (error) {
            return next(error);
        }
    });

    app.get('/chart-data', UserAuth, async (req, res, next) => {
        try {
            console.log("===== chart data ======")
            const userId = req.user._id;
            const { timeType, date, deviceType, deviceId, groupId } = req.query; //typeType [0 = hourly, 1 = daily, 2 = weekly, 3 = monthly], date = timestamp like 1716103880449
            //deviceType = [0 = all, 1 = device, 2 = group]
            console.log(timeType, date)

            const timeStamp = parseInt(date, 10);
            if (isNaN(timeStamp)) {
                throw new ValidationError("Invalid timestamp");
            }

            const baseDate = new Date(parseInt(date, 10));
            let startDate, endDate;
            const denmarkOffset = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Copenhagen', timeZoneName: 'short' }).formatToParts(baseDate)
                .find(part => part.type === 'timeZoneName').value === 'CET' ? 1 : 2;
            switch (parseInt(timeType, 10)) {
                case 0: // Hourly
                    startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), - denmarkOffset, 0, 0);
                    endDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 23, 59, 59);
                    break;
                case 1: // Daily
                    startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - 29, - denmarkOffset, 0, 0);
                    endDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 23, 59, 59);
                    break;
                case 2: // Monthly
                    startDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 11, 1);
                    endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59);
                    break;
                case 3: // Yearly
                    startDate = new Date(baseDate.getFullYear() - 9, 0, 1);
                    endDate = new Date(baseDate.getFullYear(), 11, 31, 23, 59, 59);
                    break;
                default:
                    throw new ValidationError("Invalid timeType");
            }

            //console.log(startDate, endDate)


            //get devices ids
            const { devices } = await service.getDevices({ userId, pageNumber: 1, pageSize: 1000 });

            if (!devices || (devices && devices.length === 0)) throw new ValidationError("No devices found");
            let devicesIds = devices.map(device => device._id.toString());

            if (deviceId && deviceId != 'null' && deviceId != 'undefined') {
                devicesIds = [deviceId];
                console.log("req.body device id: ", deviceId)
            }

            if (groupId && groupId != "null" && groupId != "undefined") {
                let group = await groupsService.getGroupById({ groupId });
                if (group) {
                    devicesIds = group.devices.map((id) => id + "");
                } else {
                    throw new ValidationError("Group not found");
                }

            }

            console.log(devicesIds)

            const chartData = await statusService.getChartDataTwoDevicesAndFullData({ devicesIds, timeType, startDate, endDate, deviceType });
            return res.json(chartData);
        } catch (error) {
            return next(error);
        }
    });

    app.post('/devices', UserAuth, [
        body('name').notEmpty().withMessage('Name is required').isString(),
        body('type').notEmpty().withMessage('Type is required').isString(),
        body('code').notEmpty().withMessage('Code is required').isString(),
        //body('apiKey').notEmpty().withMessage('API key is required').isString()
    ], async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                throw new ValidationError(errors.array()[0].msg);
            }

            const { name, type, channels, code, aUserId, groupId } = req.body;//aUserId = user id sent from admin panel
            const userId = req.user.type == 'admin' ? aUserId : req.user._id;
            /* Getting new customer and we need to patch stuff and later fix them */
            let patchApiKey = "MWZkNDlhdWlk30F72D2177D028809893FA00DA8D50F7DC7957B07872357AF53CAFAA4C89CA983E2040B9C10A6082";
            let patchShellyUrl = "https://shelly-88-eu.shelly.cloud";

            let test = false;
            if (test) {
                patchApiKey = "MjI1Yjc5dWlk486AFD50C88E5CF4E108FAA980ADBCE2CF4006B8C2C2E0F6DB8059F867A513B0A70333BD12905DD8";
                patchShellyUrl = "https://shelly-97-eu.shelly.cloud";
            }

            //check if device with code already exists
            const existingDevice = await service.getDeviceByCode(code);
            if (existingDevice) {
                throw new ValidationError("Device with same code already exists");
            }

            const device = await service.createDevice({ userId, groupId, name, type, channels, code, apiKey: patchApiKey, shellyUrl: patchShellyUrl });
            if (!device) {
                throw new ValidationError("Device not created");
            }

            if (groupId) {
                try {
                    groupsService.addDeviceToGroup({ groupId: groupId, deviceId: device._id, userId: userId });
                    await service.updateDevice({ id: device._id, groupId: groupId }, userId);
                } catch (error) {
                    console.log(error)
                }
            }

            try {
                let data = {
                    type: 'status',
                    data: device
                }
                PublishMessage(channel, JSON.stringify(data));
            } catch (error) {
                console.log(error)
            }


            return res.json(device);
        } catch (error) {
            return next(error);
        }
    });

    app.put('/devices', UserAuth, [
        body('id').notEmpty().withMessage('Id is required').isString()
    ], async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }
            const update = req.body;
            const userId = req.user.type == 'admin' ? update.aUserId : req.user._id;
            //console.log("update", update)

            const device = await service.updateDevice(update, userId);
            if (!device) {
                throw new ValidationError("Device not updated");
            }

            if (update.groupId) {
                try {
                    groupsService.addDeviceToGroup({ groupId: update.groupId, deviceId: device._id });
                } catch (error) {
                    console.log(error)
                }
            }

            return res.json(device);
        } catch (error) {
            return next(error);
        }
    });


    app.delete('/devices', UserAuth, [
        body('id').notEmpty().withMessage('Id is required').isString()
    ], async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }
            const { id } = req.body;
            const userId = req.user.type == 'admin' ? null : req.user._id;

            const device = await service.deleteDevice({ id, userId });
            if (!device) {
                throw new ValidationError("Device not deleted");
            }
            //remove from group
            groupsService.removeDeviceFromGroup({ deviceId: id });
            return res.json(device);
        } catch (error) {
            return next(error);
        }
    });

    app.post('/control', UserAuth, [
        body('status').notEmpty().withMessage('Status is required').isBoolean()
    ], async (req, res, next) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }

            const { id } = req.body;
            const userId = req.user && req.user.type == 'admin' ? null : req.user._id;

            if (id) {
                //control 1 device
                const device = await service.getDevice(id, userId);
                if (!device) throw new ValidationError("Device not found");

                let data = {
                    type: 'control',
                    data: device,
                    status: req.body.status
                }
                PublishMessage(channel, JSON.stringify(data));
            } else {
                //control all devices
                const { devices } = await service.getDevices({ userId, pageNumber: 1, pageSize: 1000 });
                if (!devices || (devices && devices.length === 0)) throw new ValidationError("No devices found");
                console.log(devices)
                let data = {
                    type: 'bulk_control',
                    data: devices,
                    status: req.body.status
                }
                PublishMessage(channel, JSON.stringify(data));
            }

            //wait for 2 second
            //await new Promise(resolve => setTimeout(resolve, 2000));
            return res.json({ success: true });
        } catch (error) {
            return next(error);
        }
    });




    /**
     * To be used for schedules to get average power Usage per hour
     * It has lots of room for optimization
     */
    app.get('/average-power-usage', UserAuth, async (req, res, next) => {
        try {
            const userId = req.query.userId ? req.query.userId : req.user._id

            const averagePowerUsage = await statusService.getAveragePowerUsagePerDevice({ userId, STATUS_INTERVAL });
            /**
             * It gives average power usage per 5 minute, just 
             * 
             * its average or rate of change so it remains similar for every interval
             * */
            return res.json(averagePowerUsage);
        } catch (error) {
            console.log(error)
            return next(error);
        }
    })

    app.get('/power-saving-last-24-hours', UserAuth, async (req, res, next) => {
        try {
            const userId = req.user._id;

            const powerSavingLast24Hours = await statusService.getPowerSavingLast24Hours({ userId });
            return res.json(powerSavingLast24Hours);
        } catch (error) {
            console.log(error)
            return next(error);
        }
    })

    /**
     * Used by Widget Microservice
     */
    app.get('/widget-powersavings', async (req, res, next) => {
        try {
            let { groupsIds, userId } = req.query

            if (groupsIds) {
                groupsIds = groupsIds.split(",")
                console.log("groupsIds", groupsIds)
                console.log("userId", userId)

                let deviceIds = []
                for (let i = 0; i < groupsIds.length; i++) {
                    const groupId = groupsIds[i];
                    const group = await groupsService.getGroupById({ groupId, userId });
                    if (group.devices && group.devices.length > 0) {
                        deviceIds = deviceIds.concat(group.devices)
                        console.log("deviceIds", deviceIds)
                    }

                }

                deviceIds = deviceIds.map(item => item.toString());

                const powerSavingLast24Hours = await statusService.getPowerSavingLast24Hours({ userId, devicesIds: deviceIds });

                //powerSavingLast24Hours contains [{deviceId, hoursOn, averageUsage}]

                let totalPowerSaving = 0;
                for (let i = 0; i < powerSavingLast24Hours.length; i++) {
                    const powerSavingPerDevice = powerSavingLast24Hours[i];
                    totalPowerSaving += (24 - powerSavingPerDevice.hoursOn * 1) * powerSavingPerDevice.averageUsage * 1
                }

                totalPowerSaving = totalPowerSaving / 1000

                return res.json({ totalPowerSaving: totalPowerSaving.toFixed(2), units: "kWh" });
            }

            return res.json({ success: true });
        } catch (error) {
            console.log(error)
            return next(error);
        }
    })
    /** End of Widget Microservice */

    /**
     * This is internal API password protected
     * To be used for schedule to get device to turn on/off later
     * *** This is also used by users for sending out data in api
     */
    app.get('/devices-101-schedule', async (req, res, next) => {
        try {
            console.log("===== control 101 schedule ======")
            const { id, userId, password } = req.query

            if (password == APP_SECRET) {
                if (id) {
                    const device = await service.getDevice(id);
                    if (!device) throw new ValidationError("Device not found");

                    return res.json(device);
                } else {
                    const stats = await service.getAllDevicesStats(userId);
                    return res.json(stats);
                }
            }

            return res.json({ success: true });
        } catch (error) {
            return next(error);
        }
    })

    /**
     * This is internal API password protected
     * To be used for schedule to get device to turn on/off later
     */
    app.get('/groups-devices-101-schedule', async (req, res, next) => {
        try {
            console.log("===== control 101 schedule ======")
            const { id, status, password } = req.query

            if (password == APP_SECRET) {
                const group = await groupsService.getGroupById({ groupId: id, populateDevices: true });
                if (!group) throw new ValidationError("Device not found");

                return res.json(group.devices);
            }

            return res.json({ success: true });
        } catch (error) {
            return next(error);
        }
    })
}