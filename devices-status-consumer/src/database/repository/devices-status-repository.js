const { DevicesStatusModel } = require('../models');

class DevicesStatusRepository {

    async create(userId, deviceId, isOnline, totalPowerConsumption, powerConsumption, powerUsage, voltage, current) {
        const deviceStatus = {
            userId,
            deviceId,
            isOnline,
            totalPowerConsumption,
            powerConsumption,
            powerUsage,
            voltage,
            current
        };

        return await DevicesStatusModel.create(deviceStatus);
    }

    async getByDeviceId(deviceId) {
        const deviceStatuses = await DevicesStatusModel.find({ deviceId }).sort({ timestamp: -1 }).exec();
        return deviceStatuses;
    }
}

module.exports = DevicesStatusRepository;


