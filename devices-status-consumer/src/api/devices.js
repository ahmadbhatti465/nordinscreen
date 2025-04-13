const DevicesService = require('../services/devices-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage } = require('../utils');
const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors/app-errors');

module.exports = (app, channel) => {


    const service = new DevicesService();

    //To listen
    SubscribeMessage(channel, service);

    
}