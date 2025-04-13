const WidgetService = require('../services/widget-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage } = require('../utils');
const { body, validationResult } = require('express-validator');
const { ValidationError, AuthorizationError } = require('../utils/errors/app-errors');
const { DEVICES_URL } = require('../config');
const axios = require('axios');

module.exports = (app, channel) => {

    const service = new WidgetService();

    // To listen
    SubscribeMessage(channel, service);

    app.post('/widget', UserAuth, [
        body('name').notEmpty().withMessage('Name is required').isString(),
        body('type').notEmpty().withMessage('Type is required').isString(),
        body('groupsIds').notEmpty().withMessage('GroupsIds is required')
    ], async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new ValidationError(errors.array()[0].msg);

            let { name, type, groupsIds, aUserId } = req.body;

            groupsIds = JSON.parse(groupsIds);

            const userId = req.user.type == 'admin' ? aUserId : req.user._id;

            const data = await service.createWidget({ name, type, userId, groupsIds });
            return res.json(data);
        } catch (error) {
            return next(error);
        }

    });

    app.get('/widget/:token?', UserAuth, async (req, res, next) => {
        try {
            let { token } = req.query;
            console.log("token", token)

            if (token) {

                const widget = await service.getWidgetByToken(token);
                console.log("widget", widget)
                if (widget.type == 'powersavings') {
                    if (widget.groupsIds && widget.groupsIds.length > 0) {
                        //change groupsIds from array to string
                        let groupsIds = widget.groupsIds.join(',');
                        //request from devices/groups for data;
                        console.log("request from devices/groups for powersavings data");
                        const data = await axios.get(`${DEVICES_URL}/widget-powersavings?userId=${widget.userId}&groupsIds=${groupsIds}`);
                        console.log(data.data);

                        return res.json(data.data);
                    }
                }

                throw new ValidationError('widget not found');
            } else {

                const widgets = await service.getWidgets({ userId: req.user._id });

                return res.json({widgets: widgets});
            }

        } catch (error) {
            return next(error);
        }
    })

    app.put('/widget', UserAuth, [
        body('id').notEmpty().withMessage('Id is required').isString(),
        body('name').notEmpty().withMessage('Name is required').isString(),
        body('type').notEmpty().withMessage('Type is required').isString(),
        body('groupsIds').notEmpty().withMessage('GroupsIds is required')
    ], async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                throw new ValidationError(errors.array()[0].msg);
            }
            const { id, name, type } = req.body;
            const userId = req.user._id;
            const groupsIds = req.body.groupsIds ? JSON.parse(req.body.groupsIds) : [];

            const group = await service.updateWidget({ id, name, type, groupsIds, userId });
            return res.json(group);
        } catch (error) {
            return next(error);
        }
    });

    app.delete('/widget', UserAuth, [
        body('id').notEmpty().withMessage('Id is required').isString()
    ], async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }
            const { id } = req.body;
            const userId = req.user.type == 'admin' ? null : req.user._id;

            const widget = await service.deleteWidget({ id, userId });
            if (!widget) {
                throw new ValidationError("Widget not deleted");
            }
            return res.json(widget);
        } catch (error) {
            return next(error);
        }
    });



    app.get('/whoami', (req, res, next) => {
        return res.status(200).json({ msg: '/user : I am NordicScreen Widget Service' })
    })
}