const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    type: { type: String, enum: ['user', 'admin'], default: 'user' },
    gender: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    status: { type: String, required: false },
    resetPasswordCode: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports = mongoose.model('user', UserSchema);