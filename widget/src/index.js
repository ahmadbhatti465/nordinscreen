const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
const { CreateChannel } = require('./utils');
const errorHandler = require('./utils/errors')

const StartServer = async() => {
    
    const app = express();
    
    await databaseConnection();
    
    const channel = await CreateChannel();
    
    await expressApp(app, channel);

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
        process.exit(0);
    });
}

StartServer();