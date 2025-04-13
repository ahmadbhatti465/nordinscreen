const DevicesService = require('../services/devices-service');

module.exports = (app) => {

    const service = new DevicesService();
    app.use('/app-events', async (req, res, next) => {
        const { payload } = req.body;

        //handle subscribe events
        service.SubscribeEvents(payload);

        console.log("============= User ================");
        console.log(payload);

        return res.json(payload);
    })
}