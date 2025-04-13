const { EnergyRepository } = require('../database');
const { NotFoundError, ValidationError } = require('../utils/errors/app-errors');

class EnergyService {
    constructor() {
        this.repository = new EnergyRepository();
    }


    async createEnergy(userInputs) {
        const { userId, deviceId, deviceName, consumed, saved, powerConsumption, co2EmissionReduction } = userInputs;
        const energy = await this.repository.createEnergy(userId, deviceId, deviceName, consumed, saved, powerConsumption, co2EmissionReduction);
        return energy
    }

    async getLastConsumedEnergy(userInputs) {
        const { deviceId } = userInputs;
        const energy = await this.repository.findLastConsumedEnergy(deviceId);
        return energy
    }

    async getPowerSavingLast24Hours(userInputs) {
        const { userId, devicesIds } = userInputs;
        if (!userId) throw new ValidationError('userId not found');
        const result = await this.repository.powerSavingLast24Hours(userId, devicesIds);
        if (!result) throw new ValidationError('No data found');
        return result;
    }
    async getCo2EmissionReduction(userInputs) {
        const { userId, devicesIds } = userInputs;
        if (!userId) throw new ValidationError('userId not found');
        const result = await this.repository.co2EmissionReduction(userId, devicesIds);
        if (!result) throw new ValidationError('No data found');
        return result;
    }


    //start web socket services
    async getPowerConsumption(userInputs) {
        const { userId, dateRange } = userInputs;
        if (!userId) throw new ValidationError('userId not found');
        let startDate = dateRange.startDate;
        let endDate = dateRange.endDate;
        const result = await this.repository.powerConsumption(userId, startDate, endDate);
        return result;
    }
    async getPowerSaving(userInputs) {
        const { userId, dateRange } = userInputs;
        if (!userId) throw new ValidationError('userId not found');
        let startDate = dateRange.startDate;
        let endDate = dateRange.endDate;
        const result = await this.repository.powerSaving(userId, startDate, endDate);
        return result;
    }
    async getCO2EmissionReduction(userInputs) {
        const { userId, dateRange } = userInputs;
        if (!userId) throw new ValidationError('userId not found');
        let startDate = dateRange.startDate;
        let endDate = dateRange.endDate;
        const result = await this.repository.co2EmissionReduction(userId, startDate, endDate);
        return result;
    }
    //end web socket services
}

module.exports = EnergyService;