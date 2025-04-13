const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DevicesStatusSchema = new Schema({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },

    isOnline: { type: Boolean, default: false },
    totalPowerConsumption: { type: Number, default: 0 },
    powerConsumption: { type: Number, default: 0 },
    powerUsage: { type: Number, default: 0 },
    voltage: { type: Number, default: 0 },
    current: { type: Number, default: 0 },


    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('devicesStatus', DevicesStatusSchema);