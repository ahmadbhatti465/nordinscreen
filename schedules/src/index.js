const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
const { CreateChannel } = require('./utils');
const errorHandler = require('./utils/errors');
const Factory = require('./utils/factory');
const { Agenda } = require('agenda');


const StartServer = async() => {
    
    const app = express();
    
    //handle agenda schedules
    const agenda = new Agenda();
    Factory.agenda = agenda;

    await databaseConnection();

    
    
    //const channel = await CreateChannel();
    
    await expressApp(app);

    errorHandler(app);
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
    .on('error', (error) => {
        console.log('Server error');
        console.log(error);
        process.exit(1);
    })
    .on('close', () => {
        console.log('Server closed');
        channel.close();
        agenda.close();
        process.exit(0);
    });
}

StartServer();