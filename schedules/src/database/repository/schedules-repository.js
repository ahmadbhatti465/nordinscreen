const { SchedulesModel } = require('../models');

class SchedulesRepository {
    async createSchedule(userId, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek) {
        return await SchedulesModel.create({ userId, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek });
    }

    async getSchedule(id) {
        return await SchedulesModel.findById(id);
    }
    //deprecated
    async getTotalHoursSavedPerDevice(userId) {
        const totalHoursSavedPerDevice = await SchedulesModel.aggregate([
            { $match: { userId } },
            // Stage 1: Add fields for start and end hours and minutes
            {
                $addFields: {
                    startHour: {
                        $toInt: { $substr: ["$startTime", 0, 2] }
                    },
                    startMinute: {
                        $toInt: { $substr: ["$startTime", 3, 2] }
                    },
                    endHour: {
                        $toInt: { $substr: ["$endTime", 0, 2] }
                    },
                    endMinute: {
                        $toInt: { $substr: ["$endTime", 3, 2] }
                    }
                }
            },
            // Stage 2: Calculate the total duration in minutes
            {
                $addFields: {
                    durationMinutes: {
                        $subtract: [
                            {
                                $add: [
                                    { $multiply: ["$endHour", 60] },
                                    "$endMinute"
                                ]
                            },
                            {
                                $add: [
                                    { $multiply: ["$startHour", 60] },
                                    "$startMinute"
                                ]
                            }
                        ]
                    }
                }
            },
            // Stage 3: Convert the duration to hours
            {
                $addFields: {
                    durationHours: {
                        $divide: ["$durationMinutes", 60]
                    }
                }
            },
            // Stage 4: Calculate the total hours used per day
            {
                $addFields: {
                    totalHoursUsed: {
                        $multiply: [
                            "$durationHours",
                            "$executionCount"
                        ]
                    }
                }
            },
            // Stage 5: Calculate the total hours saved per day
            {
                $addFields: {
                    totalHoursSaved: {
                        $subtract: [
                            {
                                $multiply: [
                                    "$executionCount",
                                    24
                                ]
                            },
                            "$totalHoursUsed"
                        ]
                    }
                }
            },
            // Stage 6: Project the result to include only the relevant fields
            {
                $project: {
                    _id: 0,
                    deviceId: 1,
                    totalHoursUsed: 1,
                    totalHoursSaved: 1,
                }
            },
            // Stage 7: Group by and sum the total hours saved
            {
                $group: {
                    _id: "$deviceId",
                    totalHoursSaved: {
                        $sum: "$totalHoursSaved"
                    }
                }
            },
            // Stage 8: Rename _id to deviceId in the final output
            {
                $project: {
                    _id: 0,
                    deviceId: "$_id",
                    totalHoursSaved: 1
                }
            }
        ])

        return totalHoursSavedPerDevice
    }


    async updateSchedule(id, deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek) {
        const schedule = { deviceId, groupId, scheduleType, name, startTime, endTime, daysOfWeek };
        return await SchedulesModel.findByIdAndUpdate(id, schedule, { new: true });
    }

    async updateScheduleExecutionCount(id) {

        return await SchedulesModel.findByIdAndUpdate(id, { $inc: { executionCount: 1 } }, { new: true });
    }

    async updateScheduleExecutionTries(id, resetExecutionTries = false){
        if(resetExecutionTries) return await SchedulesModel.findByIdAndUpdate(id, { $set: { executionTries: 0 } }, { new: true });
        
        return await SchedulesModel.findByIdAndUpdate(id, { $inc: { executionTries: 1 } }, { new: true });
    }

    async updateScheduleState(id, state, executionInfo) {
        return await SchedulesModel.findByIdAndUpdate(id, { state, executionInfo, updatedAt: new Date() }, { new: true });
    }

    async deleteSchedule(id, userId) {
        return await SchedulesModel.findByIdAndDelete({ _id: id, userId });
    }

    async getSchedules(userId, pageNumber = 1, pageSize = 20) {
        const skip = (pageNumber - 1) * pageSize;
        const schedules = await SchedulesModel.find({ userId }).skip(skip).limit(pageSize);
        const total = await SchedulesModel.countDocuments({ userId });
        const pagination = { total, pages: Math.ceil(total / pageSize), per_page: pageSize, page: pageNumber };
        return { schedules, pagination };
    }

    async getAllSchedules(pageNumber = 1, pageSize = 100) {
        const skip = (pageNumber - 1) * pageSize;
        const schedules = await SchedulesModel.find({}).skip(skip).limit(pageSize);
        const total = await SchedulesModel.countDocuments({});
        const pagination = { total, pages: Math.ceil(total / pageSize), per_page: pageSize, page: pageNumber };
        return { schedules, pagination };
    }
}

module.exports = SchedulesRepository;

