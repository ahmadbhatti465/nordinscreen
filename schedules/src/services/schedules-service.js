const { SchedulesRepository } = require('../database');
const { PublishMessage } = require('../utils');
const { NotFoundError, ValidationError } = require('../utils/errors/app-errors');


class SchedulesService {
    constructor() {
        this.repository = new SchedulesRepository();
    }

    async createSchedule(userInputs) {
        const { userId, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek } = userInputs;
        let schedule = await this.repository.createSchedule(userId, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek);
        if (!schedule) throw new ValidationError('schedule not created');
        return schedule
    }
    async getScheduleById(id) {
        let schedule = await this.repository.getSchedule(id);
        if (!schedule) throw new NotFoundError('schedule not found');
        return schedule
    }

    async getTotalHoursSavedPerDevice(userInputs) {
        const { userId } = userInputs;
        let totalHoursSaved = await this.repository.getTotalHoursSavedPerDevice(userId);
        if (!totalHoursSaved) throw new NotFoundError('no data found');
        return totalHoursSaved
    }

    async getSchedules(userInputs) {
        const { userId, pageNumber = 1, pageSize = 20 } = userInputs;
        let schedules = await this.repository.getSchedules(userId, pageNumber, pageSize);
        if (!schedules) throw new NotFoundError('no schedules found');
        return schedules
    }

    async getAllSchedules(pageNumber = 1, pageSize = 100) {
        let schedules = await this.repository.getAllSchedules(pageNumber, pageSize);
        if (!schedules) throw new NotFoundError('no schedules found');
        return schedules
    }

    async updateSchedule(userInputs) {
        const { id, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek } = userInputs;
        let updatedSchedule = await this.repository.updateSchedule(id, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek);
        if (!updatedSchedule) throw new NotFoundError('schedule not found');
        return updatedSchedule
    }

    async updateScheduleExecutionCount(id) {
        let updatedSchedule = await this.repository.updateScheduleExecutionCount(id);
        if (!updatedSchedule) throw new NotFoundError('schedule not found');
        return updatedSchedule
    }

    async updateScheduleState(id, state, executionInfo) {
        return await this.repository.updateScheduleState(id, state, executionInfo);
    }

    async deleteSchedule(userInputs) {
        const { id, userId } = userInputs;

        let deletedSchedule = await this.repository.deleteSchedule(id, userId);
        if (!deletedSchedule) throw new NotFoundError('schedule not found');
        return deletedSchedule
    }

    async tryScheduleAgain(parsedData, channel) {
        let schedule = await this.getScheduleById(parsedData.scheduleId);
        console.log(schedule)
        if (schedule.executionTries > 2) {
            await this.repository.updateScheduleState(parsedData.scheduleId, 'error', "Unknown reason");
        } else {
            let myData = {
                type: 'control',
                data: parsedData.device,
                status: parsedData.status,
                scheduleId: parsedData.scheduleId
            }
            PublishMessage(channel, JSON.stringify(myData));
        }
    }

    /**
     * 
     * @param {*} parsedData 
     * @param {*} channel This is RabbitMQ channel to publish to devices-status-consumer
     */
    async waitAndCheckStatus(parsedData, channel) {
        let that = this;
        let timeoutDelay = 10000;
        let device = parsedData.device;
        if (device && device.channels > 1 && parsedData.status) {
            //make sure you select the right channel from the array
            for (let i = 0; i < device.channelsDelays; i++) {
                let channelIndex = device.channelsDelays.findIndex((channelDelay) => channelDelay.channel == i);

                timeoutDelay += 1000 * device.channelsDelays[channelIndex].delay;
            }
        }
        setTimeout(async () => {
            let schedule = await that.getScheduleById(parsedData.scheduleId);
            if (schedule.state != 'completed') {
                if (schedule.executionTries > 2) {
                    await that.repository.updateScheduleState(parsedData.scheduleId, 'error', "Unknown reason");
                } else {
                    let myData = {
                        type: 'control',
                        data: parsedData.device,
                        status: parsedData.status,
                        scheduleId: parsedData.scheduleId
                    }
                    PublishMessage(channel, JSON.stringify(myData));
                }
            }
        }, timeoutDelay);
    }


    /**
     *
     * Description: 
     * SubscribeEvents function takes in two parameters: data and channel. The data parameter is expected to be a JSON string containing an object with 
     * properties device, status, state, and scheduleId. The channel parameter is optional and is used to specify a channel where the failed schedule will be retried.
     * The function first parses the data parameter into a JavaScript object using JSON.parse(). It then checks if the parsed object has a scheduleId and a state property. If both 
     * conditions are met, it updates the state of the schedule in the repository using this.repository.updateScheduleState(). It also updates the execution tries of the schedule 
     * using this.repository.updateScheduleExecutionTries().
     * If the state property of the parsed object is 'error', it calls the tryScheduleAgain function with the parsed object and the channel parameter. If the state property is 
     * 'processing', it calls the waitAndCheckStatus function with the parsed object and the channel parameter. If the state property is 'completed', it updates the execution tries 
     * of the schedule to indicate that it has completed using this.repository.updateScheduleExecutionTries().
     * 
     * @param { device, status, state, scheduleId, message, error } data 
     * @param {*} channel device-status-consumer where we retry the failed schedule
     * @returns 
     */
    async SubscribeEvents(data, channel) {
        let parsedData = JSON.parse(data)
        console.log("parsedData", parsedData)
        if (parsedData.scheduleId && parsedData.state) {
            await this.repository.updateScheduleState(parsedData.scheduleId, parsedData.state, parsedData.message ? parsedData.message : "SchedulesService SubscribeEvents");
            await this.repository.updateScheduleExecutionTries(parsedData.scheduleId);
            if (parsedData.state == 'error') {
                this.tryScheduleAgain(parsedData, channel);
            } else if (parsedData.state == 'processing') {
                this.waitAndCheckStatus(parsedData, channel);
            } else if (parsedData.state == 'completed') {
                await this.repository.updateScheduleExecutionTries(parsedData.scheduleId, true);
            }
        }
        return
    }

}

module.exports = SchedulesService