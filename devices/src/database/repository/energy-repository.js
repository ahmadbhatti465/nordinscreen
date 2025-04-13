const mongoose = require('mongoose');
const { EnergyModel } = require('../models');

class EnergyRepository {
    constructor() {
    }

    async createEnergy(userId, deviceId, deviceName, consumed, saved, powerConsumption, co2EmissionReduction) {
        console.log("createEnergy", userId, deviceId, deviceName, consumed, saved, powerConsumption, co2EmissionReduction)
        const energy = new EnergyModel({
            userId,
            deviceId,
            deviceName,
            consumed,
            saved,
            powerConsumption,
            co2EmissionReduction
        });
        await energy.save();
        return energy;
    }

    async getSavedEnergy({ userId, deviceId }) {
        //aggregate and sum saved energy

        const energy = await EnergyModel.aggregate([
            { $match: { userId, deviceId } },
            { $group: { _id: null, saved: { $sum: "$saved" } } }
        ]);

        return energy[0] ? energy[0].saved : 0
    }

    async findLastConsumedEnergy(deviceId) {

        const energy = await EnergyModel.findOne({ deviceId: deviceId, consumed: { $gt: 0 } }).sort({ createdAt: -1 })

        return energy
    }

    async powerSavingLast24Hours(userId, deviceIds = []) {
        //console.log("powerSavingLast24Hours", userId, deviceIds)

        let where = {
            userId: userId,
            createdAt: {
                $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        }

        if (deviceIds.length > 0) {
            where.deviceId = { $in: deviceIds }
        }

        const deviceSavedEnergy = await EnergyModel.aggregate([
            { $match: where },
            {
                $group: {
                    _id: "$deviceId",
                    totalSaved: { $sum: "$saved" },
                }
            },
            {
                $project: {
                    _id: 0,
                    deviceId: "$_id",
                    totalSaved: 1,
                }
            }
        ]);

        return deviceSavedEnergy
    }
    async co2EmissionReduction(userId, deviceIds = []) {
        //console.log("powerSavingLast24Hours", userId, deviceIds)

        let where = {
            userId: userId,
            createdAt: {
                $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        }

        if (deviceIds.length > 0) {
            where.deviceId = { $in: deviceIds }
        }

        const co2Emission = await EnergyModel.aggregate([
            { $match: where },
            {
                $group: {
                    _id: "$deviceId",
                    totalCo2EmissionReduction: { $sum: "$co2EmissionReduction" }
                }
            },
            {
                $project: {
                    _id: 0,
                    deviceId: "$_id",
                    totalCo2EmissionReduction: 1
                }
            }
        ]);

        return co2Emission
    }

    /* 
    async getTotalPowerConsumption(userId, startDate, endDate) {
        const result = await this.DevicesStatusModel.aggregate([
            { $match: { userId, createdAt: { $gte: startDate, $lte: endDate } } },
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
         */

    //start: web socket functions
    async powerConsumption(userId, startDate, endDate) {
        //console.log("powerConsumption", userId, startDate, endDate)

        let where = {
            userId: userId,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }
        const powerConsumption = await EnergyModel.aggregate([
            { $match: where },
            {
                $project: {
                    powerUsage_kWh: { $multiply: ["$powerConsumption", 1 / 1000] }//1/12 * 1/1000 for Kilo
                }
            },
            {
                $group: {
                    _id: null,  // No grouping, just summing all documents
                    totalPowerConsumption: { $sum: "$powerUsage_kWh" }
                }
            }
        ]);

        if (!powerConsumption || powerConsumption.length == 0) return 0;

        return powerConsumption[0].totalPowerConsumption
    }

    async powerSaving(userId, startDate, endDate) {
        const result = await EnergyModel.aggregate([
            { $match: { userId, createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $project: {
                    powerSaving_kWh: { $multiply: ["$saved", 1 / 1000] }//1/12 * 1/1000 for Kilo
                }
            },
            {
                $group: {
                    _id: null,  // No grouping, just summing all documents
                    totalPowerSaving: { $sum: "$powerSaving_kWh" }
                }
            }
        ]);

        if (!result || result.length == 0) return 0;
        return result[0].totalPowerSaving;
    }

    async co2EmissionReduction(userId, startDate, endDate) {
        const result = await EnergyModel.aggregate([
            { $match: { userId, createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: null,  // No grouping, just summing all documents
                    totalCo2EmissionReduction: { $sum: {$multiply: ["$co2EmissionReduction", 1/1000]} }//1/1000 for kilograms
                }
            }
        ]);

        if (!result || result.length == 0) return 0;
        return result[0].totalCo2EmissionReduction;
    }
    //end: web socket functions

}

module.exports = EnergyRepository