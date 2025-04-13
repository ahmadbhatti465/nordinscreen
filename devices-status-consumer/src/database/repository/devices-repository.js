const mongoose = require('mongoose');
const { DevicesModel } = require('../models');

class DevicesRepository {
    async createDevice(userId, name, type, channels, code, apiKey, shellyUrl) {
        const device = new DevicesModel({
            userId,
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
        let where = { _id: id };
        if (userId) where.userId = userId;
        const device = await DevicesModel.findOne(where);
        return device;
    }
    async getDeviceByCode(code){
        const device = await DevicesModel.findOne({code});
        return device;
    }
    async getDevices(userId, pageNumber = 1, pageSize = 20, fields = []) {
        //console.log("getDevices", userId, pageNumber, pageSize)
        let PER_PAGE_DEVICES = pageSize;
        let where = {};
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
            // if(fields['update'])
            // const devices = await DevicesModel.findOneAndUpdate(where).select(select).limit(PER_PAGE_DEVICES).skip(skip);
            // return {
            //     devices: devices,
            //     pagination: pagination
            // };
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
    async updateDevice({ id, name, type, channels, code, apiKey, userId, isOnline, isTurnedOn, totalPowerConsumption, currentPowerUsage, currentVoltage, currentCurrent }) {
        const device = {};
        if (name !== undefined) device.name = name;
        if (type !== undefined) device.type = type;
        if (channels !== undefined) device.channels = channels;
        if (code !== undefined) device.code = code;
        if (apiKey !== undefined) device.apiKey = apiKey;
        if (isOnline !== undefined) device.isOnline = isOnline;
        if (isTurnedOn !== undefined) device.isTurnedOn = isTurnedOn;
        if (totalPowerConsumption !== undefined) device.totalPowerConsumption = totalPowerConsumption;
        if (currentPowerUsage !== undefined) device.currentPowerUsage = currentPowerUsage;
        if (currentVoltage !== undefined) device.currentVoltage = currentVoltage;
        if (currentCurrent !== undefined) device.currentCurrent = currentCurrent;

        let where = { _id: id };
        if(userId) where.userId = userId
        //console.log("============= Device ================");
        //console.log(device)
        //const updatedDevice = await DevicesModel.findByIdAndUpdate(id, device, { new: true });
        const updatedDevice = await DevicesModel.findOneAndUpdate(where, device, { new: true });
        return updatedDevice;
    }

    async deleteDevice(id, userId) {
        let where = { _id: id};
        if(userId) where.userId = userId
        const deletedDevice = await DevicesModel.findOneAndDelete(where);
        return deletedDevice;
    }

    async getAllDevicesStats(userId) {
        let where = {};
        if(userId) where.userId = userId

        let stats = await DevicesModel.aggregate([
            {
                $match: where
            },
            {
                $group: {
                    _id: null,
                    currentPowerUsage: { $sum: "$currentPowerUsage" },
                    totalCurrentPowerUsage: { $sum: "$currentPowerUsage" },
                    totalIsTurnedOn: { $sum: { $cond: { if: "$isTurnedOn", then: 1, else: 0 } } },
                    totalIsOnline: { $sum: { $cond: { if: "$isOnline", then: 1, else: 0 } } },
                    totalDevices: { $sum: 1 }
                }
            }
        ]
        );

        return stats
    }

    async getXDevicesStats(userId, numberOfDevices = 2) {
        let where = {};
        if(userId) where.userId = userId

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
                $project:{
                    name: 1,
                    totalPowerConsumption: 1
                }
            }
        ]);

        return stats

    }
}

module.exports = DevicesRepository