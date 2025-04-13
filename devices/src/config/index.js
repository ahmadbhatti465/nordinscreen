const dotEnv = require('dotenv');

if(process.env.NODE_ENV !== 'prod') {
    const configFile = './.env.${process.env.NODE_ENV}';
    dotEnv.config({path: configFile});
} else {
    dotEnv.config();
}

module.exports = {
    PORT: process.env.PORT,
    AGENDA_NAME: process.env.AGENDA_NAME,
    DB_URL: process.env.MONGODB_URI,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    APP_SECRET: process.env.APP_SECRET,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
    CUSTOMER_SERVICE: "customer_service",
    DEVICE_SERVICE: "device_service",
    DEVICE_SERVICE_STATUS: "devices_service_status",
    STATUS_INTERVAL: process.env.STATUS_INTERVAL || 5
};