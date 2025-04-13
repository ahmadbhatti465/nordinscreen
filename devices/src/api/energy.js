const axios = require('axios');
const DevicesService = require('../services/devices-service');
const DevicesStatusService = require('../services/devices-status-service');
const EnergyService = require('../services/energy-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage, PublishMessage } = require('../utils');
const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors/app-errors');
const Factory = require('../utils/factory');


module.exports = (app, channel) => {
    const service = new EnergyService();
    const devicesService = new DevicesService();
    const statusService = new DevicesStatusService();

    app.get('/energy/last-24-hours', UserAuth, async (req, res, next) => {
        try {
            const userId = req.user._id;

            const powerSavingLast24Hours = await service.getPowerSavingLast24Hours({ userId });
            const co2EmissionReduction = await service.getCo2EmissionReduction({ userId });
            return res.json({ powerSavingLast24Hours, co2EmissionReduction });
        } catch (error) {
            console.log(error)
            return next(error);
        }
    })

    //calculate energy consumption every 1 minute
    async function calculateEnergy() {
        console.log("calculate energy function")

        let devices = await devicesService.getAllDevices();
        let devicesIds = devices.map(device => device._id.toString());
        console.log(devicesIds)

        let powerSaving = await statusService.getPowerSavingHourly({ devicesIds: devicesIds })
        //console.log(powerSaving)
        console.log("=========================================start calculate energy=======================================")
        let resultPowerSaving = [];
        for (let index = 0; index < devices.length; index++) {
            const device = devices[index];

            //find device._id in powerSaving with key
            let powerSavingOfDevice = powerSaving[device._id.toString()];
            //console.log(device, powerSavingOfDevice)

            let consumed = 0, saved = 0, powerConsumption = 0, co2EmissionReduction = 0;
            if (powerSavingOfDevice) {

                consumed = powerSavingOfDevice.minutesVoltageGreaterThanZero > 0 ? powerSavingOfDevice.powerConsumption * (powerSavingOfDevice.minutesVoltageGreaterThanZero / 60) : 0;
                //saved = powerSavingOfDevice.minutesVoltageZero > 0 ? powerSavingOfDevice.powerConsumption * (powerSavingOfDevice.minutesVoltageZero / 60) : 0;
                saved = 60 - powerSavingOfDevice.minutesVoltageGreaterThanZero > 0 ? powerSavingOfDevice.powerConsumption * (60 - powerSavingOfDevice.minutesVoltageGreaterThanZero) / 60 : 0;
                powerConsumption = powerSavingOfDevice.powerConsumption;


                /**
                 * issue#59: co2EmissionReduction should be calculated by bringing live power factor 
                 * From page: https://www.energidataservice.dk/tso-electricity/CO2Emis
                 * They provide api: https://api.energidataservice.dk/dataset/CO2Emis?offset=0&sort=Minutes5UTC%20DESC&limit=1
                 * */
                let co2EmissionGrams = 187.3;
                try {

                    let co2Emission = await axios.get(`https://api.energidataservice.dk/dataset/CO2Emis?offset=0&sort=Minutes5UTC%20DESC&limit=1`)
                    co2EmissionGrams = co2Emission.data.records[0].CO2Emission
                    console.log("co2EmissionGrams", co2EmissionGrams)
                } catch (err) {
                    console.log("err", err)
                }

                co2EmissionReduction = saved * co2EmissionGrams / 1000;

                if (consumed <= 0 && saved <= 0 && powerConsumption <= 0) {
                    //find last Energy that was saved 
                    //where consumed > 0 
                    //meaning: we get its powerConsumption and that's what is saved energy

                    let energy = await service.getLastConsumedEnergy({ deviceId: device._id.toString() });
                    if (energy) {
                        consumed = 0;
                        saved = energy.powerConsumption; //100watt * 1 hour = 100wh
                        powerConsumption = 0
                    }
                }
            } else {
                let energy = await service.getLastConsumedEnergy({ deviceId: device._id.toString() });
                if (energy) {
                    consumed = 0;
                    saved = energy.powerConsumption; //100watt * 1 hour = 100wh
                    powerConsumption = 0
                    co2EmissionReduction = saved * 0.1873
                }
            }

            let res = {
                userId: device.userId,
                deviceId: device._id.toString(),
                deviceName: device.name,
                consumed: consumed,
                saved: saved,
                powerConsumption: powerConsumption,
                co2EmissionReduction: co2EmissionReduction
            }
            let saveEnergy = await service.createEnergy(res);

            resultPowerSaving.push(res)
        }
        //console.log(resultPowerSaving)

        console.log("=========================================end calculate energy=======================================")
    }



    (async () => {
        //calculateEnergy();
        try {
            //await Factory.agenda.purge();
            await Factory.agenda.start();
            await Factory.agenda.cancel({}) // remove all jobs

            await Factory.agenda.define("calculate", async (job, done) => {
                try {
                    await calculateEnergy();
                    console.log("============= Every hour calculate energy ================")
                    done();
                } catch (error) {
                    console.log(error);
                    done();
                }
            })
            //0 * * * * for every hour
            //* * * * * for every minute
            Factory.agenda.every('0 * * * *', 'calculate', {}, { skipImmediate: false });

        } catch (error) {
            console.log(error);
        }

    })();

}