const dotEnv = require('dotenv');

if(process.env.NODE_ENV !== 'prod') {
    const configFile = './.env.${process.env.NODE_ENV}';
    dotEnv.config({path: configFile});
} else {
    dotEnv.config();
}

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    APP_SECRET: process.env.APP_SECRET,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
    DEVICES_URL: process.env.DEVICES_URL,
    CUSTOMER_SERVICE: "customer_service",
    DEVICE_SERVICE: "device_service",
};