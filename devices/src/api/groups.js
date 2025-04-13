const GroupsService = require('../services/groups-service');
const DevicesService = require('../services/devices-service');
const DevicesStatusService = require('../services/devices-status-service');

const UserAuth = require('./middlewares/auth');
const { SubscribeMessage, PublishMessage } = require('../utils');
const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors/app-errors');

module.exports = (app, channel) => {
    const service = new GroupsService();
    const devicesService = new DevicesService();
    const statusService = new DevicesStatusService();

    /**
     * Link looks like: 
     * http://localhost:3000/devices/groups
     *  
     **/
    app.get('/groups/:id?', UserAuth, async (req, res) => {
        console.log("Getting groups")
        //console.log("query", req.query, req.user)
        const { id } = req.query
        let userId = req.user._id;
        //userId = req.user.type == 'admin' && req.query.userId != 'null' ? req.query.userId : userId;

        if (id) {
            const group = await service.getGroupById({ groupId: id, userId });
            if (!device) throw new ValidationError("Device not found");
            return res.json(group);
        } else {
            console.log("getting all groups")
            const pageNumber = req.query.pageNumber || 1;
            const pageSize = req.query.pageSize || 1000;
            const fields = req.query.fields ? req.query.fields.split(",") : [];
            const { groups, pagination } = await service.getGroups({ userId, pageNumber: pageNumber * 1, pageSize: pageSize * 1, fields });
            return res.json({ groups, pagination });
        }
    });

    app.post('/groups', UserAuth, [
        body('name').notEmpty().withMessage('Name is required').isString(),
    ], async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                throw new ValidationError(errors.array()[0].msg);
            }
            const { name } = req.body;
            let devices = req.body.devices ? JSON.parse(req.body.devices) : [];

            const userId = req.user._id;
            const group = await service.createGroup({ userId, name, devices });
            //updated devices with groupId
            if(devices.length > 0){
                await devicesService.updateDevicesWithGroupId({ groupId: group._id, devices });

            }

            return res.json(group);
        } catch (error) {
            return next(error);
        }
    });

    app.put('/groups', UserAuth, [
        body('id').notEmpty().withMessage('Id is required').isString(),
        body('name').notEmpty().withMessage('Name is required').isString()
    ], async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                throw new ValidationError(errors.array()[0].msg);
            }
            const { id, name } = req.body;
            const userId = req.user._id;
            const devices = req.body.devices ? JSON.parse(req.body.devices) : [];

            const group = await service.updateGroup({ groupId: id, name, devices, userId });
            return res.json(group);
        } catch (error) {
            return next(error);
        }
    });

    app.delete('/groups', UserAuth, [
        body('id').notEmpty().withMessage('Id is required').isString()
    ], async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                throw new ValidationError(errors.array()[0].msg);
            }
            const { id } = req.body;
            const userId = req.user._id;
            const group = await service.getGroupById({ groupId: id, userId });
            await service.deleteGroup({ groupId: id, userId });

            const defaultGroup = await service.getDefaultGroup({ userId });
            //console.log("defaultGroup", defaultGroup)
            await devicesService.updateDevicesWithGroupId({ groupId: null, devices: group.devices });
            if(group.devices.length > 0){
                for (let index = 0; index < group.devices.length; index++) {
                    const deviceId = group.devices[index];
                    console.log("deviceId", deviceId)
                    await service.addDeviceToGroup({ groupId: defaultGroup._id, deviceId})
                }
            }

            //remove groupId from devices
            //await devicesService.updateDevicesWithGroupId({ groupId: null, devices: group.devices });
            return res.json(group);
        } catch (error) {
            return next(error);
        }
    });
}