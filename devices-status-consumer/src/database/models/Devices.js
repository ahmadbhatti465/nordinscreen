const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const channelDelaySchema = new Schema({
    channel: { type: Number, required: true },
    delay: { type: Number, required: true }
});

const DevicesSchema = new Schema({
    userId: { type: String, required: true },

    name: { type: String, required: true },
    type: { type: String, required: true },
    channels: { type: Number, default: 1 },
    code: { type: String, required: true, unique: true },
    apiKey: { type: String, required: true },
    shellyUrl: { type: String, default: '' },

    status: { type: String, default: '' },
    channelsDelays: { type: [channelDelaySchema], default: [] },

    isOnline: { type: Boolean, default: false },
    isTurnedOn: { type: Boolean, default: false },

    totalPowerConsumption: { type: Number, default: 0 },
    currentPowerUsage: { type: Number, default: 0 },
    currentVoltage: { type: Number, default: 0 },
    currentCurrent: { type: Number, default: 0 },    

    showLogs: { type: Boolean, default: false },
    forceStop: { type: Boolean, default: false },
    forceStopReason: { type: String, default: '' },
    forceStopAt: Date,


    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

DevicesSchema.pre('save', function (next) {
    if (this.isModified('code')) {
        this.code = this.code.toLowerCase();
    }
    next();
});

module.exports = mongoose.model('devices', DevicesSchema);