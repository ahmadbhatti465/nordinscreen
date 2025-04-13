const DevicesService = require('../services/devices-service');
const UserAuth = require('./middlewares/auth');
const { PublishMessage } = require('../utils');
const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors/app-errors');
const { STATUS_INTERVAL } = require('../config');


module.exports = (app, channel) => {


    const service = new DevicesService();

    //To listen
    //SubscribeMessage(channel, service);


    async function getAllDevices(pageNumber = 1, pageSize = 100) {
        try {
            const devices = await service.getDevices({ userId: null, pageNumber, pageSize });
            return devices;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }


    async function groupDevices(devices) {
        try {
            // Group devices by API key
            const groupedDevices = devices.reduce((acc, device) => {
                const key = device.apiKey;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(device);
                return acc;
            }, {});
            console.log("============= Grouped Devices ================")
            console.log(groupedDevices)

            // Create groups of 20 or less devices with the same API key
            const deviceGroups = [];
            for (const key in groupedDevices) {
                const devices = groupedDevices[key];
                while (devices.length > 0) {
                    deviceGroups.push(devices.splice(0, Math.min(20, devices.length)));
                }
            }

            console.log("============= Device Groups ================")
            console.log(deviceGroups)

            // Return the device groups
            return deviceGroups;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async function loopAllDevices() {
        /**
         * 1- Get 20 devices with same api key
         *  */
        let totalPages = 1;
        let currentPage = 1;
        while (currentPage <= totalPages) {

            // console.log("============= Devices ================")
            const { devices } = await getAllDevices(currentPage);//pageNumber = 1, pageSize = 100

            // console.log("============= Devices ================")
            // console.log(devices.length)


            const devicesGroups = await groupDevices(devices);
            // console.log("============= Device Groups ================")
            //console.log(deviceGroups)


            for (let i = 0; i < devicesGroups.length; i++) {
                const singleGroup = devicesGroups[i];
                //console.log("sending messages")

                let data = {
                    type: "bulk_status",
                    data: singleGroup
                }

                PublishMessage(channel, JSON.stringify(data));

                //wait for 1 sec
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            totalPages = devices.totalPages;
            currentPage++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    loopAllDevices()
    setInterval(loopAllDevices, STATUS_INTERVAL * 60 * 1000);

}