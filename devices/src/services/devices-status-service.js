const { DevicesStatusRepository } = require('../database/');
const { NotFoundError, ValidationError } = require('../utils/errors/app-errors');

class DevicesStatusService {

    constructor() {
        this.DevicesStatusRepository = new DevicesStatusRepository();
    }

    async getTotalPowerConsumption(userId) {
        const result = await this.DevicesStatusRepository.getTotalPowerConsumption(userId);
        return result;

    }

    async getLastDeviceStatusesByDeviceIds(deviceIds) {
        const result = await this.DevicesStatusRepository.getLastDeviceStatusesByDeviceIds(deviceIds);
        if (!result) throw new NotFoundError('No data found');
        return result;
    }

    async getChartDataTwoDevicesAndFullData(userInputs) {
        const { devicesIds, timeType, startDate, endDate, deviceType } = userInputs;
        if (!devicesIds) throw new ValidationError('devicesIds not found');
        if (!startDate) throw new ValidationError('startDate not found');
        if (!endDate) throw new ValidationError('endDate not found');
        //console.log(devicesIds, timeType, startDate, endDate)
        if (timeType == '' || timeType == undefined) throw new ValidationError('timeType not found');

        const result = await this.DevicesStatusRepository.chartTwoDevicesAndFullData(devicesIds, timeType, startDate, endDate, deviceType);
        if (!result) throw new ValidationError('No data found');
        return result;
    }

    async getAveragePowerUsagePerDevice(userInputs) {
        const { userId, last24Hours } = userInputs;
        if (!userId) throw new ValidationError('userId not found');
        const result = await this.DevicesStatusRepository.averagePowerUsagePerDevice(userId, last24Hours);
        if (!result) throw new ValidationError('No data found');
        return result;
    }

    async getPowerSavingLast24Hours(userInputs) {
        const { userId, devicesIds } = userInputs;
        if (!userId) throw new ValidationError('userId not found');
        const result = await this.DevicesStatusRepository.powerSavingLast24Hours(userId, devicesIds);
        if (!result) throw new ValidationError('No data found');
        return result;
    }

    async getPowerSavingHourly(userInputs) {
        const { devicesIds } = userInputs;
        if (!devicesIds) throw new ValidationError('devicesIds not found');
        const result = await this.DevicesStatusRepository.powerSavingHourly(devicesIds);
        if (!result) throw new ValidationError('No data found');
        return result;

    }

}

module.exports = DevicesStatusService