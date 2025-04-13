const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
const { CreateChannel } = require('./utils');
const errorHandler = require('./utils/errors');
const socketIO = require('socket.io');
const http = require('http');
const socketListener = new (require('./ws')).ConnectionListener();
const socketAuthMiddleware = require('./ws/middlewares/auth');
const Factory = require('./utils/factory');
const { Agenda } = require('agenda');

const StartServer = async () => {

    const app = express();

    //handle agenda energy consumption
    const agenda = new Agenda();
    Factory.agenda = agenda;

    await databaseConnection();

    

    const channel = await CreateChannel();

    await expressApp(app, channel);

    errorHandler(app);

    const server = http.createServer(app);

    const io = socketIO(server, {
        transports: ['websocket', 'polling'],
        cors: {
            origin: "*",
        }
    });

    io.use(socketAuthMiddleware)
    io.on('connect', socketListener.connected);

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
        console.log('Server closed');
        channel.close();        
        Factory.agenda.close();
        process.exit(0);
    });
}

StartServer();