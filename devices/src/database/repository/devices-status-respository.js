const mongoose = require('mongoose');
const { DevicesModel, DevicesStatusModel } = require('../models');

const { ValidationError } = require('../../utils/errors/app-errors');

class DevicesStatusRepository {
    constructor() {
        this.DevicesModel = DevicesModel;
        this.DevicesStatusModel = DevicesStatusModel;
    }

    async getTotalPowerConsumption(userId) {
        const result = await this.DevicesStatusModel.aggregate([
            { $match: { userId } },
            {
                $project: {
                    powerUsage_kWh: { $multiply: ["$powerUsage", 1 / 12] }
                }
            },
            {
                $group: {
                    _id: null,  // No grouping, just summing all documents
                    totalPowerConsumption: { $sum: "$powerUsage_kWh" }
                }
            }

        ]);

        if (!result) throw new ValidationError('No data found');
        if (result.length == 0) return 0
        return result[0].totalPowerConsumption;
    }

    async getLastDeviceStatusesByDeviceIds(deviceIds) {
        //console.log('getLastDeviceStatusesByDeviceIds', deviceIds)
        //find last status for each device
        const result = await this.DevicesStatusModel.aggregate([
            { $match: { deviceId: { $in: deviceIds } } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: "$deviceId", lastStatus: { $first: "$$ROOT" } } },
            { $project: { _id: 0, deviceId: "$_id", status: "$lastStatus" } }
        ]);
        //console.log('result', result)
        if (!result) throw new ValidationError('No data found');
        return result;
    }

    async chartTwoDevicesAndFullData(devicesIds, timeType, startDate, endDate, deviceType = null) {
        //console.log('chartData', devicesIds, timeType, startDate, endDate, selectedDeviceId)
        let groupByField;
        let dateFormat;

        switch (parseInt(timeType, 10)) {
            case 0:
                groupByField = { $hour: "$createdAt" };
                dateFormat = "%Y-%m-%d %H:00";
                break;
            case 1:
                groupByField = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                dateFormat = "%Y-%m-%d";
                break;
            case 2:
                groupByField = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
                dateFormat = "%Y-%m";
                break;
            case 3:
                groupByField = { $year: "$createdAt" };
                dateFormat = "%Y";
                break;
            default:
                throw new Error('Invalid time type');
        }

        /* const topTwoPowerUsageDevices = await this.DevicesStatusModel.aggregate([
            {
                $match: {
                    deviceId: { $in: devicesIds },
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$deviceId",
                    totalPowerUsage: { $sum: "$powerUsage" }
                }
            },
            { $sort: { totalPowerUsage: -1 } },
            { $limit: 2 }
        ]);
        //console.log('topTwoPowerUsageDevices', topTwoPowerUsageDevices)
        if (!topTwoPowerUsageDevices) throw new ValidationError('No data found');
        let newDevicesIds = topTwoPowerUsageDevices.map(device => device._id.toString())
        if (selectedDeviceId) {
            newDevicesIds = [selectedDeviceId]
            //newDevicesIds = [...newDevicesIds, selectedDeviceId]
        }

        //console.log("newDevicesIds", newDevicesIds)

        //aggregate two devices powerUsage
        const twoDevicesData = await this.DevicesStatusModel.aggregate([
            {
                $match: {
                    deviceId: { $in: newDevicesIds },
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            // Convert the timestamp to a rounded 30-minute interval
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    deviceId: 1,
                    time: groupByField,
                    createdAt: 1,
                    powerUsage_kWh: { $multiply: ["$powerUsage", 1 / 12] }
                }
            },
            {
                $group: {
                    _id: { deviceId: "$deviceId", time: "$time" }, // Group by deviceId and the specified time type
                    createdAt: { $first: "$createdAt" },
                    totalPowerConsumption: { $sum: "$powerUsage_kWh" }
                }
            },
            {
                $sort: { createdAt: 1 } // Sort by time
            }
        ])
        //console.log("twoDevicesData", twoDevicesData)

        //fetch devices and update twoDevicesData name fields

        const devices = await this.DevicesModel.find({ _id: { $in: newDevicesIds } }, { name: 1 });
        if (!devices) throw new ValidationError('No data found');

        const devicesData = {}; // Initialize an empty object to store device data

        // Iterate over the aggregated results
        twoDevicesData.forEach(result => {
            const deviceId = result._id.deviceId;
            const deviceName = devices.find(device => device._id.toString() === deviceId.toString()).name;

            // Check if the device already exists in the devicesData object
            if (!devicesData[deviceName]) {
                devicesData[deviceName] = []; // Initialize an empty array for the device if not present
            }

            // Push the data for the device into the corresponding array
            devicesData[deviceName].push({
                time: result._id.time,
                totalPowerConsumption: result.totalPowerConsumption
            });
        }); */

        //console.log(devicesData);

        //check if devicesIds is array of strings
        if (!Array.isArray(devicesIds) || devicesIds.some(deviceId => typeof deviceId !== 'string'))
            throw new ValidationError('devicesIds should be array of strings');



        //aggregate for all devices
        const allDevicesData = await this.DevicesStatusModel.aggregate([
            { $match: { deviceId: { $in: devicesIds }, createdAt: { $gte: startDate, $lte: endDate } } },
            // Convert the timestamp to a rounded 30-minute interval
            {
                $project: {
                    time: groupByField,
                    createdAt: 1,
                    powerUsage_kWh: { $multiply: ["$powerUsage", 1 / 12] }
                }
            },
            {
                $group: {
                    _id: "$time", // Group by the specified time type
                    createdAt: { $first: "$createdAt" },
                    totalPowerConsumption: { $sum: "$powerUsage_kWh" }
                }
            },
            {
                $sort: { createdAt: 1 } // Sort by time
            }
        ])

        //console.log('allDevicesData', allDevicesData)

        const result = { allDevicesData, dateFormat }

        return result
    }

    async averagePowerUsagePerDevice(userId, last24Hours = false) {
        try {
            let aggr = [
                {
                    $match: {
                        userId: userId,
                        voltage: {
                            $gt: 0
                        },
                        createdAt: {
                            $gte: last24Hours ? new Date(Date.now() - 24 * 60 * 60 * 1000) : new Date(0)
                        }
                    },
                },
                {
                    $group: {
                        _id: "$deviceId",
                        averagePowerUsagePerHour: {
                            $avg: "$powerUsage"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        deviceId: "$_id",
                        averagePowerUsagePerHour: 1
                    }
                }
            ];
            //console.log('aggr', JSON.stringify(aggr))
            const result = await this.DevicesStatusModel.aggregate(aggr)
            //console.log("result", result)




            if (!result) throw new ValidationError('No data found')
            return result
        } catch (error) {
            throw error
        }
    }

    async powerSavingHourly(deviceIds = []) {
        //console.log("powerSavingLast24Hours", deviceIds)
        //console.log(new Date(Date.now() - 1 * 60 * 60 * 1000))
        let where = {
            createdAt: {
                $gte: new Date(Date.now() - 1 * 60 * 60 * 1000)
            },
            voltage: { $gt: 0 }
        }
        if (deviceIds.length > 0) {
            where.deviceId = { $in: deviceIds }
        }

        const statuses = await this.DevicesStatusModel.find(where, { deviceId: 1, createdAt: 1, voltage: 1, powerConsumption: 1 });


        const hoursUsed = statuses.reduce((acc, status) => {
            const deviceId = status.deviceId;
            const createdAt = status.createdAt;
            const voltage = status.voltage;
            const powerConsumption = status.powerConsumption;
            if (!acc[deviceId]) {
                acc[deviceId] = { deviceId, minutesVoltageZero: 0, minutesVoltageGreaterThanZero: 0, averageUsage: [], powerConsumption: 0, prev: { createdAt, voltage, powerConsumption } };
            }
            if (voltage > 0 && powerConsumption > 0) {
                const prev = acc[deviceId].prev;
                const current = { createdAt, voltage, powerConsumption };
                let timeDiffMinutes = (new Date(current.createdAt).getTime() - new Date(prev.createdAt).getTime()) / (1000 * 60); // Convert milliseconds to minutes
                //console.log("timeDiffMinutes", timeDiffMinutes)
                timeDiffMinutes = timeDiffMinutes <= 0 ? 5 : timeDiffMinutes;

                if (prev.voltage === 0) {
                    acc[deviceId].minutesVoltageZero += Math.round(timeDiffMinutes);
                } else if (prev.voltage > 0) {
                    acc[deviceId].minutesVoltageGreaterThanZero += Math.round(timeDiffMinutes);
                    acc[deviceId].averageUsage.push(prev.powerConsumption);
                }

                acc[deviceId].powerConsumption = Math.round(acc[deviceId].averageUsage.reduce((a, b) => a + b, 0) / acc[deviceId].averageUsage.length);

                acc[deviceId].prev = current;

            }

            return acc;
        }, {});

        //console.log("hoursUsed", hoursUsed)

        //combine devices
        // const combinedResults = hoursUsed.map(hours => {
        //     const matchingUsage = averageUsage.find(usage => usage.deviceId === hours.deviceId);
        //     return {
        //         deviceId: hours.deviceId,
        //         hoursOn: hours.hoursOn,
        //         averageUsage: matchingUsage ? matchingUsage.averageUsage : 0
        //     };
        // });

        //console.log("hoursUsed", hoursUsed)


        return hoursUsed
    }
    async powerSavingLast24Hours(userId, deviceIds = []) {
        //console.log("powerSavingLast24Hours", userId, deviceIds)
        let where = {
            userId: userId,
            createdAt: {
                $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            },
            voltage: { $gt: 0 }
        }
        if (deviceIds.length > 0) {
            where.deviceId = { $in: deviceIds }
        }

        const hoursUsed = await this.DevicesStatusModel.aggregate([
            {
                $match: where
            },
            {
                $group: {
                    _id: "$deviceId",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    deviceId: "$_id",
                    hoursOn: { $multiply: [{ $divide: ["$count", 12] }, 1] },// 5 minutes interval so we put 12 = 60/5
                }
            }
        ]);

        //console.log("hoursUsed", hoursUsed)

        let aggr = [
            {
                $match: where
            },
            {
                $group: {
                    _id: "$deviceId",
                    averageUsage: {
                        $avg: "$powerUsage"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    deviceId: "$_id",
                    averageUsage: 1
                }
            }
        ];
        const averageUsage = await this.DevicesStatusModel.aggregate(aggr)
        //console.log("averageUsage", averageUsage)

        //combine devices
        const combinedResults = hoursUsed.map(hours => {
            const matchingUsage = averageUsage.find(usage => usage.deviceId === hours.deviceId);
            return {
                deviceId: hours.deviceId,
                hoursOn: hours.hoursOn,
                averageUsage: matchingUsage ? matchingUsage.averageUsage : 0
            };
        });

        //console.log("combinedResults", combinedResults)


        return combinedResults
    }
    /* Tested the following aggregation on date 2024-06-03
        results are 100% correct so I need to correct old calculations based on the following and also need to make sure date is correct with timezone.
        Timezone doesn't matter here as data is fetched in UTC. so ignore following: 
        //User timezone is in europe/copenhagen and server timezone is in UTC 
    [{
        $match: {
            deviceId: "664c71e6d321f60013414fc7",
            createdAt: {
            $gte: ISODate('2024-06-03')
            },
            voltage: {
            $gt: 0
            }
        }
        },
        {
            $group: {
            _id: "$deviceId",
            averagePowerUsagePerHour: {
                $avg: {
                $multiply: ["$powerUsage", 1]
                }
            }
            }
        },
        {
            $project: {
            _id: 0,
            deviceId: "$_id",
            averagePowerUsagePerHour: 1
            }
        }
    ]
    */
}

module.exports = DevicesStatusRepository