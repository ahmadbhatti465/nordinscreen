const mongoose = require('mongoose');
const { DB_URL, AGENDA_NAME } = require('../config');
const Factory = require('../utils/factory');


module.exports = async()=>{
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        Factory.agenda.database(DB_URL, AGENDA_NAME);

        console.log("Database connected");
        console.log("Really")
    } catch (error) {
        console.log("Error ============= ON DB CONNECTION");
        console.log(error);
        Factory.agenda.stop();

    }
}