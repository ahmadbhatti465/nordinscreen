
const SchedulesService = require('../services/schedules-service');
const UserAuth = require('./middlewares/auth');
const { body, validationResult } = require('express-validator');
const { ValidationError, NotFoundError } = require('../utils/errors/app-errors');
const Factory = require('../utils/factory');
const { convertToCronExpression, PublishMessage, SubscribeMessage } = require('../utils');
const axios = require('axios');
const { APP_SECRET, DEVICES_URL } = require('../config');

module.exports = (app, channel) => {
    //const service = new service();
    const service = new SchedulesService();

    SubscribeMessage(channel, service);


    app.get('/schedules/:id?', UserAuth, async (req, res, next) => {
        try {
            const { id } = req.query;
            if (id) {
                const schedule = await service.getScheduleById(id);
                return res.json(schedule);
            } else {
                console.log("Getting all schedules");
                const pageNumber = req.query.pageNumber || 1;
                const pageSize = req.query.pageSize || 20;

                const { schedules, pagination } = await service.getSchedules({ userId: req.user._id, pageNumber, pageSize });
                console.log(schedules);
                if (!schedules) throw new NotFoundError('no schedules found');
                return res.json({ schedules, pagination });

            }

        } catch (error) {
            console.log(error);
            return next(error);
        }
    })

    app.get('/energy-saved-stats', UserAuth, async (req, res, next) => {

        try {
            let retval = {
                totalEnergySaved: 0,
                co2EmissionReduction: 0,
                treesSaved: 0,
                coalSaved: 0
            }

            const hoursSavedPerDevice = await service.getTotalHoursSavedPerDevice({ userId: req.user._id });
            console.log("hoursSavedPerDevice", hoursSavedPerDevice)
            const averagePowerUsagePerDevice = await axios.get(`${DEVICES_URL}/average-power-usage`, {
                headers: {
                    'Authorization': `Bearer ${req.token}`
                }
            });

            if (!hoursSavedPerDevice) throw new NotFoundError('no data found');
            if (!averagePowerUsagePerDevice || !averagePowerUsagePerDevice.data) throw new NotFoundError('no data found');

            //lets calculate energy saved
            for (let i = 0; i < hoursSavedPerDevice.length; i++) {
                let deviceUsage = averagePowerUsagePerDevice.data.find(device => device.deviceId === hoursSavedPerDevice[i].deviceId);
                console.log("deviceUsage", deviceUsage)
                retval.totalEnergySaved += (hoursSavedPerDevice[i].totalHoursSaved * deviceUsage.averagePowerUsagePerHour);
            }

            retval.totalEnergySaved = Math.round(retval.totalEnergySaved) / 1000; //kWh


            //lets calculate co2 reduction
            /**
             * CO2 reduction factor = 0.1873kg CO2/kWh for Denmark
             * source: https://www.carbonfootprint.com/
             */
            retval.co2EmissionReduction = retval.totalEnergySaved * 0.1873;
            retval.coalSaved = retval.co2EmissionReduction * 0.8;
            retval.treesSaved = retval.co2EmissionReduction * 0.2;

            return res.json(retval);
        } catch (error) {
            console.log(error);
            return next(error);
        }
    })

    app.post('/schedules', UserAuth, [
        body('scheduleType').exists().withMessage('scheduleType is required'),
        body('name').exists().withMessage('Name is required'),
        body('startTime').exists().withMessage('StartTime is required'),
        body('endTime').exists().withMessage('EndTime is required'),
        body('daysOfWeek').exists().withMessage('DaysOfWeek is required'),

    ], async (req, res, next) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                throw new ValidationError(errors.array()[0].msg);
            }

            //convert days of week json string to array
            req.body.daysOfWeek = JSON.parse(req.body.daysOfWeek);

            const { deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek } = req.body;
            const userId = req.user._id;

            if (!deviceId && !groupId) throw new ValidationError('deviceId or groupId is required');


            const schedule = await service.createSchedule({ userId, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek });

            if (!schedule) throw new ValidationError('schedule not created');

            await createAgenda(schedule);

            return res.json(schedule);
        } catch (error) {
            console.log(error);
            return next(error);
        }


    });

    app.put('/schedules', UserAuth, [
        body('id').exists().withMessage('ScheduleId is required'),
        body('name').exists().withMessage('Name is required'),
        body('startTime').exists().withMessage('StartTime is required'),
        body('endTime').exists().withMessage('EndTime is required'),
        body('daysOfWeek').exists().withMessage('DaysOfWeek is required'),
    ],
        async (req, res, next) => {
            try {
                try {
                    req.body.daysOfWeek = JSON.parse(req.body.daysOfWeek);
                } catch (err) {
                    throw new ValidationError('DaysOfWeek must be an JSON Array of days of week');
                }
                if (!Array.isArray(req.body.daysOfWeek)) throw new ValidationError('DaysOfWeek must be an JSON String array');

                const { id, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek } = req.body;
                const userId = req.user._id;

                if (!deviceId && !groupId) throw new ValidationError('deviceId or groupId is required');

                const schedule = await service.updateSchedule({ id, userId, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek });
                if (!schedule) throw new ValidationError('schedule not updated');

                await removeAgenda(schedule);
                await createAgenda(schedule);

                return res.json(schedule);
            } catch (error) {
                console.log(error);
                return next(error);
            }
        })

    app.delete('/schedules', UserAuth, async (req, res, next) => {
        try {
            const { id } = req.query;
            const userId = req.user._id;
            const oldSchedule = await service.getScheduleById(id);
            if (!oldSchedule) throw new ValidationError('schedule not found');

            const schedule = await service.deleteSchedule({ id, userId });
            if (!schedule) throw new ValidationError('schedule not deleted');

            await removeAgenda(oldSchedule);

            return res.json(schedule);
        } catch (error) {
            console.log(error);
            return next(error);
        }
    })

    /**
     * Publish schedule to devices-status-consumer
     */
    async function publishScheduleToDevicesStatusConsumer(scheduleId, device, status) {
        let data = {
            type: 'control',
            data: device,
            status: status,
            scheduleId
        }
        PublishMessage(channel, JSON.stringify(data));
    }
    /**
     * 
     * Schedule Using Agenda Helpers
     */
    async function createAgenda(schedule) {
        /**
         * 1 device has 1 schedule
         * each schedule has 1 ON (startTime) and 1 OFF (endTime), and daysOfWeek in array ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
         */

        let startTime = schedule.startTime;
        let endTime = schedule.endTime;
        let daysOfWeek = schedule.daysOfWeek;

        let moveToNextDay = startTime > endTime; //ex: "17:59" > "18:00" = false so don't move Turning Off to next day

        let deviceStartCronExpression = convertToCronExpression(startTime, daysOfWeek);
        let deviceEndCronExpression = convertToCronExpression(endTime, daysOfWeek, moveToNextDay);

        console.log(deviceStartCronExpression)
        console.log(deviceEndCronExpression)




        await Factory.agenda.define("scheduleId-" + schedule._id + "deviceId-" + schedule.deviceId + "-ON", async (job) => {
            try {
                //await service.processSchedules(schedule);
                console.log("============= Schedule StartTime Published ================")
                await service.updateScheduleExecutionCount(schedule._id);
                await service.updateScheduleState(schedule._id, 'initiated');
                //return response.data; // Assuming the device information is in JSON format
                if (schedule.scheduleType == 'group') {
                    console.log("============= Schedule GroupId Published ================")
                    const data = await axios.get(`${DEVICES_URL}/groups-devices-101-schedule?id=${schedule.groupId}&password=${APP_SECRET}`);
                    let devices = data.data;
                    //console.log("devices: ", devices);
                    devices.forEach(async (device) => {
                        publishScheduleToDevicesStatusConsumer(schedule._id, device, true);
                        if (device) {
                        } else {
                            await service.updateScheduleState(schedule._id, 'error', JSON.stringify(device));
                        }
                    })
                } else {
                    const device = await axios.get(`${DEVICES_URL}/devices-101-schedule?id=${schedule.deviceId}&password=${APP_SECRET}`);
                    console.log("device: ", device.data);
                    publishScheduleToDevicesStatusConsumer(schedule._id, device.data, true);
                    if (device.data) {
                    } else {
                        await service.updateScheduleState(schedule._id, 'error', JSON.stringify(device.data));
                    }
                }


            } catch (error) {
                console.log("Error: ", error);
                await service.updateScheduleState(schedule._id, 'error', JSON.stringify(error));
            }
        })

        await Factory.agenda.define("scheduleId-" + schedule._id + "deviceId-" + schedule.deviceId + "-OFF", async (job) => {
            try {
                //await service.processSchedules(schedule);
                console.log("============= Schedule EndTime Published ================")
                await service.updateScheduleState(schedule._id, 'initiated');
                //const response = await axios.get(`${DEVICES_URL}/control-101-schedule?id=${schedule.deviceId}&status=false&password=${APP_SECRET}`);

                if (schedule.scheduleType == 'group') {
                    console.log("============= Schedule GroupId Published ================")
                    const data = await axios.get(`${DEVICES_URL}/groups-devices-101-schedule?id=${schedule.groupId}&password=${APP_SECRET}`);
                    let devices = data.data;
                    //console.log("devices: ", devices);
                    devices.forEach(async (device) => {
                        publishScheduleToDevicesStatusConsumer(schedule._id, device, false);
                        if (device) {
                        } else {
                            await service.updateScheduleState(schedule._id, 'error', JSON.stringify(device));
                        }
                    })
                } else {

                    const device = await axios.get(`${DEVICES_URL}/devices-101-schedule?id=${schedule.deviceId}&password=${APP_SECRET}`);
                    console.log("device: ", device.data);

                    publishScheduleToDevicesStatusConsumer(schedule._id, device.data, false);

                    if (device.data) {
                        //await service.updateScheduleState(schedule._id, 'processing', JSON.stringify(device.data));
                    } else {
                        await service.updateScheduleState(schedule._id, 'error', JSON.stringify(device.data));
                    }

                }
            } catch (error) {
                console.log(error);
                await service.updateScheduleState(schedule._id, 'error', JSON.stringify(error));
            }
        })

        //

        await Factory.agenda.every(deviceStartCronExpression, "scheduleId-" + schedule._id + "deviceId-" + schedule.deviceId + "-ON", {}, { skipImmediate: true, timezone: 'Europe/Copenhagen' });
        await Factory.agenda.every(deviceEndCronExpression, "scheduleId-" + schedule._id + "deviceId-" + schedule.deviceId + "-OFF", {}, { skipImmediate: true, timezone: 'Europe/Copenhagen' });

    }

    async function removeAgenda(schedule) {
        await Factory.agenda.cancel({ name: "scheduleId-" + schedule._id + "deviceId-" + schedule.deviceId + "-ON" });
        await Factory.agenda.cancel({ name: "scheduleId-" + schedule._id + "deviceId-" + schedule.deviceId + "-OFF" });
    }

    async function loopAllSchedules() {
        /**
         * 1- Get 100 schedules
         *  */
        let totalPages = 1;
        let currentPage = 1;
        while (currentPage <= totalPages) {

            console.log("============= Schedules ================")
            const { schedules } = await service.getAllSchedules({ pageNumber: currentPage, pageSize: 100 });//pageNumber = 1, pageSize = 100

            console.log("============= Schedules Fetched ================")
            console.log(schedules.length)

            for (let i = 0; i < schedules.length; i++) {
                const singleSchedule = schedules[i];
                console.log("============= Schedules Agenda =================")

                await createAgenda(singleSchedule);


                //wait for 1 sec
                //await new Promise(resolve => setTimeout(resolve, 1000));
            }

            totalPages = schedules.totalPages;
            currentPage++;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }


    (async () => {
        try {
            //await Factory.agenda.purge();

            await Factory.agenda.start();
            await Factory.agenda.cancel({}) // remove all jobs

            await Factory.agenda.define("loopAllSchedules", async (job, done) => {
                try {
                    await loopAllSchedules();
                    console.log("============= 24 hours Loop All Schedules ================")
                    done();
                } catch (error) {
                    console.log(error);
                    done();
                }
            })

            Factory.agenda.every('24 hours', 'loopAllSchedules', {}, { skipImmediate: false });

        } catch (error) {
            console.log(error);
        }

    })();

}