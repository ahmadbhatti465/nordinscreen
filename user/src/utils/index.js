const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const fetch = require('node-fetch');
const fs = require('node:fs/promises');
const path = require('node:path');

const {
    APP_SECRET,
    EXCHANGE_NAME,
    USER_SERVICE,
    MSG_QUEUE_URL
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

module.exports.PublishMessage = async (channel, service, msg) => {
    try {
        await channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
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

        channel.bindQueue(q.queue, EXCHANGE_NAME, USER_SERVICE);


        channel.consume(
            q.queue,
            (msg) => {
                if (msg.content) {
                    console.log("Message received: ", msg.content.toString());
                    service.SubscribeEvents(msg.content.toString());
                }
                console.log("[X] received");
            },
            { noAck: true }
        );
    } catch (error) {
        throw error;
    }
}

module.exports.GenerateRandomNumber = () => {
    const min = 100000
    const max = 999999
    return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports.SendEmail = async (email, username) => {
    const projectId = process.env.SCW_PROJECT_ID
    const region = process.env.REGION
    const authToken = process.env.SCW_SECRET_KEY

    const templatePath = path.join(__dirname, 'forgot-password.html');

    let emailHtml = await fs.readFile(templatePath, { encoding: 'utf8' });

    const verficationCode = this.GenerateRandomNumber()

    const link = `https://app.q-power.io/#/reset-password/${email}/${verficationCode}`

    emailHtml = emailHtml.replace('[User Name]', username)
    emailHtml = emailHtml.replace('[Verification Link]', link)
    emailHtml = emailHtml.replace('[Verification Code]', verficationCode)

    const emailConfig = {
        from: {
            name: "Q-Power Admin",
            email: "admin@q-power.io"
        },
        to: [
            {
                name: username,
                email: email,
            }
        ],
        subject: "Password reset link Do Not reply",
        text: `Hello ${username} \nTo reset your password, please use the following verification link`,
        html: emailHtml,
        project_id: projectId,
        additional_headers: [
            {
                key: "Reply-To",
                value: "admin@q-power.io"
            },
            {
                key: "x-project-tracker",
                value: "1234"
            }
        ]
    };

    try {
        const emailRes = await fetch(`https://api.scaleway.com/transactional-email/v1alpha1/regions/${region}/emails`, {
            method: 'POST',
            headers: {
                "X-Auth-Token": authToken,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(emailConfig)
        });

        if (!emailRes.ok) {
            const errorText = await emailRes.text();
            throw new Error(`Network response was not ok: ${emailRes.status} - ${errorText}`);
        }

        const responseData = await emailRes.json();
        return {
            data: responseData,
            otp: verficationCode
        }
    } catch (error) {
        console.error('Error sending email:', error);
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