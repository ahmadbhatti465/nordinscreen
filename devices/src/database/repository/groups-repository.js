const mongoose = require('mongoose');
const { GroupsModel, DevicesModel } = require('../models');

class GroupsRepository {
    constructor() {
    }

    async createGroup(userId, name, devices, isDefault = false) {
        const group = new GroupsModel({
            userId,
            name,
            devices,
            isDefault
        });
        const newGroup = await group.save();
        //remove devices from group where isDefault = true
        await GroupsModel.updateMany(
            { devices: { $in: devices }, isDefault: true },
            { $pullAll: { devices: devices } }
        );
        return newGroup;
    }

    async getDefaultGroup(userId) {
        const groups = await GroupsModel.findOne({ userId, isDefault: true });
        return groups;
    }

    async getGroup(id, userId, populateDevices = false) {
        let where = { _id: id };
        if (userId) where.userId = userId;

        let group;
        if (populateDevices) {
            group = await GroupsModel.findOne(where).populate('devices');
        } else {
            group = await GroupsModel.findOne(where);
        }
        return group;
    }

    async getGroups(userId, pageNumber = 1, pageSize = 20, fields = []) {
        let PER_PAGE_GROUPS = pageSize;
        let where = {};
        if (userId) {
            where.userId = userId;

            //check if user has default group if not then create one and move all devices to it.
            //only needed when user is newly created.
            const defaultGroup = await GroupsModel.findOne({ userId, isDefault: true });
            if (defaultGroup) {
                //do nothing
                console.log('default group exists');
            } else {
                console.log('default group does not exists');
                let devices = await DevicesModel.find({ userId });
                let devicesIds = devices.map(device => device._id);

                //add default group
                const group = new GroupsModel({
                    userId,
                    name: 'Default',
                    devices: [],
                    isDefault: true
                });
                const newGroup = await group.save();
                let that = this;
                //add devices to default group
                devicesIds.forEach(deviceId => {
                    that.addDeviceToGroup({ groupId: newGroup._id, deviceId });

                })
            }
        }

        const count = await GroupsModel.estimatedDocumentCount(where);
        //console.log(count);
        let page = Math.abs(pageNumber);
        let pagination = {
            total: count,
            pages: Math.ceil(count / PER_PAGE_GROUPS),
            per_page: PER_PAGE_GROUPS,
            page: isNaN(page) ? 1 : page,
        };

        if (pagination.page <= pagination.pages) {
            let skip = (pagination.page - 1) * PER_PAGE_GROUPS;
            pagination.previous = pagination.page - 1;
            pagination.next = pagination.page + 1;

            const select = {};
            fields.forEach(field => {
                if (GroupsModel.schema.obj.hasOwnProperty(field)) {
                    select[field] = 1;
                }
            });

            // if (fields.includes('devices')) {
            //     const groups = await GroupsModel.find(where).populate({
            //         path: 'devices',
            //         select: '-shellyUrl -apiKey'
            //     }).select(select).limit(PER_PAGE_GROUPS).skip(skip).sort({ isDefault: -1, createdAt: 1 });
            //     return {
            //         groups: groups,
            //         pagination: pagination
            //     };
            // } else {

            const groups = await GroupsModel.find(where)
                .select(select).limit(PER_PAGE_GROUPS).skip(skip).sort({ isDefault: -1, createdAt: 1 });
            return {
                groups: groups,
                pagination: pagination
            };
        }
        return {
            groups: [],
            pagination: { total: count, pages: Math.ceil(count / PER_PAGE_GROUPS), per_page: PER_PAGE_GROUPS, page: 1 }
        }
    }

    async updateGroup({ id, name, devices, userId }) {
        let where = { _id: id };
        if (userId) where.userId = userId;
        const updatedGroup = await GroupsModel.findOneAndUpdate(where, { name, devices }, { new: true });
        await GroupsModel.updateMany(
            { devices: { $in: devices }, isDefault: true },
            { $pullAll: { devices: devices } }
        );
        return updatedGroup;
    }

    async addDeviceToGroup({ groupId, deviceId }) {
        let where = { _id: groupId };

        // const group = await this.repository.findOne({ devices: deviceId })
        // if(group) return group;
        await GroupsModel.updateMany(
            { devices: deviceId },
            { $pull: { devices: deviceId } }
        );

        const updateDevice = await DevicesModel.findOneAndUpdate({ _id: deviceId }, { groupId: groupId }, { new: true });
        const updatedGroup = await GroupsModel.findOneAndUpdate(where, { $push: { devices: deviceId } }, { new: true });

        return updatedGroup;
    }

    async removeDeviceFromGroup(deviceId) {
        await GroupsModel.updateMany(
            { devices: deviceId },
            { $pull: { devices: deviceId } }
        );
        return true;
    }

    async deleteGroup(id, userId) {
        let where = { _id: id };
        if (userId) where.userId = userId;
        const deletedGroup = await GroupsModel.findOneAndDelete(where);
        return deletedGroup;
    }

}

module.exports = GroupsRepository