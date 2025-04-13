const express = require('express');
const cors = require('cors');
const { devices, appEvents } = require('./api');
const { CreateChannel, SubscribeMessage } = require('./utils');

module.exports = async (app, channel) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'));

    //api
    //appEvents(app);

    devices(app, channel);
}