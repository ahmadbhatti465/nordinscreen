const mongoose = require('mongoose');
const { UserModel } = require('../models')


class UserRepository {
    async createUser({ name, email, password, salt, type, gender, phone, address, status, resetPasswordCode }) {
        const user = new UserModel({
            name,
            email,
            password,
            salt,
            type,
            gender,
            phone,
            address,
            status,
            resetPasswordCode
        });
        const userResult = await user.save();
        return userResult;
    }

    async FindUserByEmail(email) {
        const user = await UserModel.findOne({ email });
        return user;
    }


    async FindUserById(id) {
        const user = await UserModel.findById(id, '_id name email type gender phone address status createdAt updatedAt').lean();
        return user;
    }

    async getUsers() {
        const users = await UserModel.find({ type: 'user' }).select('_id name');
        return users;
    }
    
    async getAllUsers() {
        const user = await UserModel.find();
        return user;
    }
}

module.exports = UserRepository;