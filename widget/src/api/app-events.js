const WidgetService = require('../services/widget-service');

module.exports = (app) => {

    const service = new WidgetService();
    app.use('/app-events', async (req, res, next) => {
        const { payload } = req.body;

        //handle subscribe events
        service.SubscribeEvents(payload);

        console.log("============= widgets ================");
        console.log(payload);

        return res.json(payload);
    })
}