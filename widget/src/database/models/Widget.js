const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WidgetSchema = new Schema({
    userId: { type: String, required: true },

    token: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['powersavings'] },
    subtype: { type: String, required: false },
    
    groupsIds: [{ type: String, required: false }],
    
}, { timestamps: true });

WidgetSchema.index({ token: 1 });
WidgetSchema.index({ userId: 1 });

module.exports = mongoose.model('widget', WidgetSchema)