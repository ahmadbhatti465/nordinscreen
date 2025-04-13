const mongoose = require('mongoose');
const { DevicesModel } = require('../models');

class DevicesRepository {
    async createDevice(userId, name, type, code, apiKey, shellyUrl) {
        const device = new DevicesModel({
            userId,
            name,
            type,
            code,
            apiKey,
            shellyUrl
        });
        const newDevice = await device.save();
        return newDevice;
    }
    async getDevice(id) {
        const device = await DevicesModel.findById(id);
        return device;
    }
    async getDevices(userId, pageNumber = 1, pageSize = 20) {
        console.log("getDevices", userId, pageNumber, pageSize)
        let PER_PAGE_DEVICES = pageSize;
        let where = { userId };

        if (userId == null) {
            where = {};
        }

        const count = await DevicesModel.estimatedDocumentCount(where);
        console.log(count);
        let page = Math.abs(pageNumber);
        let pagination = {
            total: count,
            pages: Math.ceil(count / PER_PAGE_DEVICES),
            per_page: PER_PAGE_DEVICES,
            page: isNaN(page) ? 1 : page,
        };
        if (pagination.page <= pagination.pages) {
            let skip = (pagination.page - 1) * PER_PAGE_DEVICES;
            pagination.previous = pagination.page - 1;
            pagination.next = pagination.page + 1;
            const devices = await DevicesModel.find(where).limit(PER_PAGE_DEVICES).skip(skip);
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
    async updateDevice(id, name, type, code, apiKey, userId) {
        const device = {
            name,
            type,
            code,
            apiKey
        };
        console.log("============= Device ================");
        console.log(device)
        //const updatedDevice = await DevicesModel.findByIdAndUpdate(id, device, { new: true });
        const updatedDevice = await DevicesModel.findOneAndUpdate({ _id: id, userId }, device, { new: true });
        return updatedDevice;
    }
    async deleteDevice(id) {
        const deletedDevice = await DevicesModel.findByIdAndDelete(id);
        return deletedDevice;
    }

}

module.exports = DevicesRepository