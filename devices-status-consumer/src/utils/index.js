const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const {
    APP_SECRET,
    EXCHANGE_NAME,
    MSG_QUEUE_URL,
    DEVICE_SERVICE_STATUS,
    SCHEDULE_SERVICE_STATUS
} = require("../config");

module.exports.GenerateSalt = async () => {
    return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
    enteredPassword,
    savedPassword,
    salt
) => {
    return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
    try {
        return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
    } catch (error) {
        console.log(error);
        return error;
    }
};

module.exports.ValidateSignature = async (req) => {
    try {
        const signature = req.get("Authorization");
        console.log(signature);
        if(signature == null) return false
        const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
        req.user = payload;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports.FormateData = (data) => {
    if (data) {
        return { data };
    } else {
        throw new Error("Data Not found!");
    }
}

//Message Broker
module.exports.CreateChannel = async () => {
    try {
        const connection = await amqplib.connect(MSG_QUEUE_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
        return channel;
    } catch (error) {
        throw error;
    }
};

module.exports.PublishMessage = async (channel, msg) => {
    try {
        await channel.publish(EXCHANGE_NAME, DEVICE_SERVICE_STATUS, Buffer.from(msg));
        console.log("Message sent: ", msg);
    } catch (error) {
        throw error;
    }
};

module.exports.PublishMessageToSchedules = async (channel, msg) => {
    try {
        await channel.publish(EXCHANGE_NAME, SCHEDULE_SERVICE_STATUS, Buffer.from(msg));
        console.log("Message sent: ", msg);
    } catch (error) {
        throw error;
    }
};

module.exports.SubscribeMessage = async (channel, service) => {
    try {
        await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
        const q = await channel.assertQueue("", { exclusive: true });
        console.log(` Waiting for messages in queue: ${q.queue}`);

        channel.bindQueue(q.queue, EXCHANGE_NAME, DEVICE_SERVICE_STATUS);
        channel.prefetch(1);

        await channel.consume(
            q.queue,
            async (msg) => {
                if (msg.content) {
                    //console.log("Message received: ", JSON.stringify(msg));
                    //console.log("Received message: %s", msg.content.toString());

                    await service.SubscribeEvents(msg.content.toString(), channel);

                    // Simulate processing time
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Acknowledge the message only after successful processing
                    channel.ack(msg);
                    console.log("Message processed successfully");
                }
                
            }
        );
    } catch (error) {
        throw error;
    }
}

/* module.exports.SubscribeMessage = async (channel, service, callBack) => {
    try {
        await channel.assertQueue(service, { durable: true });
        await channel.consume(
            service,
            (msg) => {
                callBack(JSON.parse(msg.content));
            },
            { noAck: true }
        );
    } catch (error) {
        throw error;
    }
} */