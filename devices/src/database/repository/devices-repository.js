const mongoose = require('mongoose');
const { DevicesModel } = require('../models');

class DevicesRepository {
    async createDevice(userId, groupId, name, type, channels, code, apiKey, shellyUrl) {
        const device = new DevicesModel({
            userId,
            groupId,
            name,
            type,
            channels,
            code,
            apiKey,
            shellyUrl
        });
        const newDevice = await device.save();
        return newDevice;
    }
    async getDevice(id, userId) {
        let where = { _id: id, deletedAt: null };
        if (userId) where.userId = userId;

        const device = await DevicesModel.findOne(where);
        return device;
    }
    async getDeviceByCode(code) {
        const device = await DevicesModel.findOne({ code, deletedAt: null });
        return device;
    }
    async getDevices(userId, pageNumber = 1, pageSize = 20, fields = []) {
        //console.log("getDevices", userId, pageNumber, pageSize)
        let PER_PAGE_DEVICES = pageSize;
        let where = { deletedAt: null };
        if (userId) {
            where.userId = userId;
        }

        const count = await DevicesModel.estimatedDocumentCount(where);
        //console.log(count);
        let page = Math.abs(pageNumber);
        let pagination = {
            total: count,
            pages: Math.ceil(count / PER_PAGE_DEVICES),
            per_page: PER_PAGE_DEVICES,
            page: isNaN(page) ? 1 : page,
        };
        if (pageNumber == -786) {
            let devices = {}
            if(fields['update'])
                devices = await DevicesModel.findOneAndUpdate(where).select(select).limit(PER_PAGE_DEVICES).skip(skip);
            if(fields['select'])
                devices = await DevicesModel.find(where).select(select).limit(PER_PAGE_DEVICES).skip(skip);
            if(fields['delete'])
                devices = await DevicesModel.findOneAndDelete(where).select(select).limit(PER_PAGE_DEVICES).skip(skip);
            return {
                devices: devices,
                pagination: pagination
            };
        }
        if (pagination.page <= pagination.pages) {
            let skip = (pagination.page - 1) * PER_PAGE_DEVICES;
            pagination.previous = pagination.page - 1;
            pagination.next = pagination.page + 1;

            const select = {};
            fields.forEach(field => {
                if (DevicesModel.schema.obj.hasOwnProperty(field)) {
                    select[field] = 1;
                }
            });

            // select['shellyUrl'] = -1;
            // select['apiKey'] = -1;

            const devices = await DevicesModel.find(where).select(select).limit(PER_PAGE_DEVICES).skip(skip);
            return {
                devices: devices,
                pagination: pagination
            };
        }
        return {
            devices: [],
            pagination: { total: count, pages: Math.ceil(count / PER_PAGE_DEVICES), per_page: PER_PAGE_DEVICES, page: 1 }
        }

    }
    async updateDevice({ id, groupId, name, type, channels, channelsDelays, code, apiKey, userId, isTurnedOn, totalPowerConsumption, currentPowerUsage, currentVoltage, currentCurrent }) {
        const device = {};
        if (name !== undefined) device.name = name;
        if (groupId !== undefined) device.groupId = groupId;
        if (type !== undefined) device.type = type;
        if (channels !== undefined) device.channels = channels;
        if (channelsDelays !== undefined) device.channelsDelays = channelsDelays;
        if (code !== undefined) device.code = code;
        if (apiKey !== undefined) device.apiKey = apiKey;
        if (isTurnedOn !== undefined) device.isTurnedOn = isTurnedOn;
        if (totalPowerConsumption !== undefined) device.totalPowerConsumption = totalPowerConsumption;
        if (currentPowerUsage !== undefined) device.currentPowerUsage = currentPowerUsage;
        if (currentVoltage !== undefined) device.currentVoltage = currentVoltage;
        if (currentCurrent !== undefined) device.currentCurrent = currentCurrent;

        let where = { _id: id };
        if (userId) where.userId = userId
        //console.log("============= update Device ================");
        //console.log(device)
        //const updatedDevice = await DevicesModel.findByIdAndUpdate(id, device, { new: true });
        const updatedDevice = await DevicesModel.findOneAndUpdate(where, device, { new: true });
        return updatedDevice;
    }

    async updateDevicesWithGroupId(groupId, devices) {
        let where = { _id: { $in: devices } };
        const updatedDevices = await DevicesModel.updateMany(where, { groupId });
        return updatedDevices;
    }

    async deleteDevice(id, userId) {
        let where = { _id: id, deletedAt: null };
        if (userId) where.userId = userId;

        const device = await DevicesModel.findOne(where);
        if (!device) throw new Error('Device not found or already deleted');

        const oldDeviceCode = device.code;
        const newDeviceCode = `del_${oldDeviceCode}_${Date.now()}`;
        const updatedDevice = await DevicesModel.findOneAndUpdate(
            where,
            {
                code: newDeviceCode,
                deletedAt: new Date()
            },
            { new: true }
        );

        return updatedDevice;
    }


    async getAllDevicesStats(userId) {
        let where = {};
        if (userId) where.userId = userId

        let stats = await DevicesModel.aggregate([
            {
                $match: where
            },
            {
                $group: {
                    _id: null,
                    currentPowerUsage: { $sum: "$currentPowerUsage" },
                    totalIsTurnedOn: { $sum: { $cond: { if: "$isTurnedOn", then: 1, else: 0 } } },
                    totalIsOnline: { $sum: { $cond: { if: "$isOnline", then: 1, else: 0 } } },
                    totalDevices: { $sum: { $cond: { if: "$deletedAt", then: 0, else: 1 } } }
                }
            }
        ]
        );

        return stats
    }

    /**
     * Used for: Energy Consumption/Saving
     */
    async getAllDevices() {
        return await DevicesModel.find({}, { _id: 1, name: 1, userId: 1 });
    }

    async getXDevicesStats(userId, numberOfDevices = 2) {
        let where = {};
        if (userId) where.userId = userId

        let stats = await DevicesModel.aggregate([
            {
                $match: where
            },
            {
                $sort: {
                    totalPowerConsumption: -1
                }
            },
            {
                $limit: numberOfDevices
            },
            {
                $project: {
                    name: 1,
                    totalPowerConsumption: 1
                }
            }
        ]);

        return stats

    }
}

module.exports = DevicesRepository