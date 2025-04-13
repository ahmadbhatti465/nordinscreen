const { GroupsRepository } = require('../database/');
const { NotFoundError, ValidationError } = require('../utils/errors/app-errors');

class GroupsService {
    constructor() {
        this.repository = new GroupsRepository();
    }

    async getDefaultGroup(userInputs) {
        const { userId } = userInputs;
        const group = await this.repository.getDefaultGroup(userId);
        return group;
    }

    async getGroupById(userInputs) {
        const { groupId, userId, populateDevices } = userInputs;
        const group = await this.repository.getGroup(groupId, userId, populateDevices);
        return group;
    }

    async createGroup(userInputs) {
        const { userId, name, devices } = userInputs;
        const group = await this.repository.createGroup(userId, name, devices);
        return group;
    }


    async updateGroup(userInputs) {
        const { groupId, name, devices, userId } = userInputs;

        //check if the user is the owner of the group
        let checkGroup = await this.getGroupById({ groupId, userId });
        if (checkGroup) {
            let group = await this.repository.updateGroup({ id: groupId, name, devices });
            return group;
        } else {
            throw new ValidationError('You are not the owner of this group');
        }


    }

    async addDeviceToGroup(userInputs) {
        const { groupId, deviceId } = userInputs;
        const group = await this.repository.addDeviceToGroup({ groupId, deviceId });
        return group;
    }

    async removeDeviceFromGroup(userInputs) {
        const { deviceId } = userInputs;

        const group = await this.repository.removeDeviceFromGroup(deviceId);
        return group;
    }


    async deleteGroup(userInputs) {
        const { groupId, userId } = userInputs;

        //console.log(groupId, userId)

        //check if the user is the owner of the group
        let checkGroup = await this.getGroupById({ groupId });
        if (checkGroup) {
            const group = await this.repository.deleteGroup(groupId);
            return group;
        } else {
            throw new ValidationError('You are not the owner of this group');
        }
    }


    async getGroups(userInputs) {
        const { userId, pageNumber = 1, pageSize = 20, fields } = userInputs;
        const groups = await this.repository.getGroups(userId, pageNumber, pageSize, fields);
        return groups;
    }
}

module.exports = GroupsService;