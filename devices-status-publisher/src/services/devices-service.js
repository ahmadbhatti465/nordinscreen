const { DevicesRepository } = require('../database/');
const { NotFoundError, ValidationError } = require('../utils/errors/app-errors');


class DevicesService {
    constructor() {
        this.repository = new DevicesRepository();
    }

    async createDevice(userInputs) {

        const { userId, name, type, channels, code, apiKey, shellyUrl } = userInputs;

        const device = await this.repository.createDevice(userId, name, type, channels, code, apiKey, shellyUrl);
        if (!device) throw new ValidationError('device not created');
        return device;
    }

    async getDevices(userInputs) {

        const { userId, pageNumber = 1, pageSize = 20, fields } = userInputs;
        const { devices, pagination } = await this.repository.getDevices(userId, pageNumber, pageSize, fields);
        if (!devices) throw new NotFoundError('no devices found');

        return { devices, pagination };
    }

    async updateDevice(userInputs, userId) {
        const { id, name, type, channels, code, apiKey } = userInputs;
        const device = await this.repository.updateDevice({ id, name, type, channels, code, apiKey, userId });
        if (!device) throw new NotFoundError('device not found');
        return device;
    }

    async deleteDevice(userInputs) {
        const { id, userId } = userInputs;
        console.log(id, userId)
        const device = await this.repository.deleteDevice(id, userId);
        if (!device) throw new NotFoundError('device not found');
        return device;
    }

    async getDevice(id, userId) {
        const device = await this.repository.getDevice(id, userId);
        if (!device) throw new NotFoundError('device not found');
        return device;
    }

    async getDeviceByCode(code){
        const device = await this.repository.getDeviceByCode(code);
        return device;
    }

    async getAllDevicesStats(userId) {
        const stats = await this.repository.getAllDevicesStats(userId);
        if (!stats || stats.length === 0) throw new NotFoundError('no data found');
        return stats[0];//Total of all devices so only first element
    }

    async getXDevicesStats(userId, numberOfDevices = 2) {
        const stats = await this.repository.getXDevicesStats(userId, numberOfDevices);
        if (!stats || stats.length === 0) throw new NotFoundError('no data found');
        return stats;
    }
}

module.exports = DevicesService