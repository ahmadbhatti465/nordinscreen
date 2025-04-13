const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupsSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    
    devices: [{ type: Schema.Types.ObjectId, ref: 'devices' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('groups', GroupsSchema);