const express = require('express');
const cors = require('cors');
const { devices, appEvents, groups, energy } = require('./api');
const { CreateChannel, SubscribeMessage } = require('./utils');

module.exports = async (app) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'));

    //api
    //appEvents(app);

    const channel = await CreateChannel();

    devices(app, channel);
    groups(app, channel);
    energy(app, channel);
}