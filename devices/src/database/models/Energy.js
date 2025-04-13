const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EnergySchema = new Schema({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    deviceName: { type: String, required: true },

    consumed: { type: Number, default: 0 },
    saved: { type: Number, default: 0 },
    powerConsumption: { type: Number, default: 0 },
    co2EmissionReduction: { type: Number, default: 0 },

}, { timestamps: true });

EnergySchema.index({ userId: 1, deviceId: 1 });

module.exports = mongoose.model('energy', EnergySchema);