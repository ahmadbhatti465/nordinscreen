const dotEnv = require('dotenv');

if(process.env.NODE_ENV !== 'prod') {
    const configFile = './.env.${process.env.NODE_ENV}';
    dotEnv.config({path: configFile});
} else {
    dotEnv.config();
}




if(!process.env.MONGODB_URI){
    dotEnv.config({path: './.env.local'});
    console.log(process.env.MONGODB_URI)
}

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    APP_SECRET: process.env.APP_SECRET,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
    DEVICE_SERVICE_STATUS: "devices_service_status",
    SCHEDULE_SERVICE_STATUS: "schedules_service_status",
};