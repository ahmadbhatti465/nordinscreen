const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchedulesSchema = new Schema({
    userId: { type: String, required: true },
    deviceId: { type: String },
    groupId: { type: String },
    scheduleType: { type: String, enum: ['device', 'group'], required: true, default: 'device' },  // discriminator field
    name: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    daysOfWeek: {
        type: [{
            type: String,
            enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }],
        required: true
    },
    isTurnedOn: { type: Boolean, default: false },
    status: { type: String, default: '' },
    // issue#
    state: { type: String, enum: ['', 'initiated', 'error', 'processing', 'completed'], default: '' },
    executionTries: { type: Number, default: 0 },
    executionInfo: { type: String, default: '' },

    executionCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

module.exports = mongoose.model('schedules', SchedulesSchema);

