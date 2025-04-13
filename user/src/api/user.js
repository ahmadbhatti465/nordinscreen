const UserService = require('../services/user-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage, SendEmail, GenerateSalt, GeneratePassword } = require('../utils');
const { body, validationResult } = require('express-validator');
const { ValidationError, AuthorizationError } = require('../utils/errors/app-errors');
const BasicAuth = require('basic-auth');
const axios = require('axios');
const { APP_SECRET, DEVICES_URL } = require('../config');

module.exports = (app, channel) => {

    const service = new UserService();

    // To listen
    SubscribeMessage(channel, service);


    app.post('/signup', async (req, res, next) => {
        await body('name').notEmpty().withMessage('The name is required').run(req);
        await body('email').isEmail().withMessage('The email is invalid').run(req);
        await body('password').isLength(6).withMessage('The password is too short').run(req);
        await body('passwordConfirmation').equals(req.body.password).withMessage('The password confirmation must match').run(req);


        try {
            const result = validationResult(req);
            if (!result.isEmpty()) throw new ValidationError(result.array()[0].msg);

            let { name, email, password, gender, phone, address, status } = req.body;
            email = email.toLowerCase();
            const data = await service.SignUp({ name, email, password, gender, phone, address, status });
            return res.json(data);
        } catch (error) {
            return next(error);
        }

    });

    app.post('/login', async (req, res, next) => {
        await body('email').isEmail().withMessage('email is invalid.').run(req);
        await body('password').exists({ checkFalsy: true }).withMessage('password is required.').run(req);

        try {
            const result = validationResult(req);
            if (!result.isEmpty()) throw new ValidationError(result.array()[0].msg);

            let { email, password } = req.body;
            email = email.toLowerCase();
            const data = await service.SignIn({ email, password });
            return res.json(data);
        } catch (error) {
            return next(error);
        }
    });

    app.post('/profile', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetProfile(_id);
            return res.json(data);
        } catch (error) {
            return next(error);
        }
    });

    app.post('/reset-password', async (req, res, next) => {
        await body('email').exists().isEmail().run(req)
        try {
            const result = validationResult(req)
            if (!result.isEmpty()) throw new ValidationError(result.array())
            let email = await req.body.email
            let userEmail = await service.repository.FindUserByEmail(email)
            if (!userEmail) return res.status(404).json({ message: "No user exists with this email!" })

            await SendEmail(userEmail.email, userEmail.name).then(async (response) => {
                const resetPasswordCode = response.otp
                userEmail.resetPasswordCode = resetPasswordCode
                await userEmail.save()
            })
            return res.json({ msg: "Password reset email has been sent to you" })

        } catch (error) {
            return next(error)
        }
    })

    app.post('/new-password', async (req, res, next) => {
        await body('email').exists().run(req)
        await body('password').exists().run(req);
        await body('resetPasswordCode').exists().run(req)
        try {
            const result = validationResult(req)
            if (!result.isEmpty()) throw new ValidationError(result.array()[0].msg)
            let email = await req.body.email
            let user = await service.repository.FindUserByEmail(email)
            if (user.resetPasswordCode === req.body.resetPasswordCode) {
                let salt = await GenerateSalt();

                let userPassword = await GeneratePassword(req.body.password, salt);
                user.password = userPassword
                user.salt = salt
                user.resetPasswordCode = ""
                await user.save()
                return res.status(200).json({ message: "Password changed successfully!" })
            } else {
                return res.status(400).json({ message: "Invalid code" })
            }
        } catch (error) {
            return next(error)
        }
    })

    app.get('/users', UserAuth, async (req, res, next) => {
        try {
            if (req.user.type !== "admin") throw new AuthorizationError("Unauthorized user");

            const users = await service.getUsers();
            return res.json(users);
        } catch (error) {
            return next(error);
        }
    })
    /* app.get('/data-feed', async (req, res, next) => {
        try {
            //if (req.user.type !== "admin") throw new AuthorizationError("Unauthorized user");
            const user = BasicAuth(req);

            console.log(user)

            email = user.name.toLowerCase();

            const password = user.pass;

            const data = await service.SignIn({ email, password });

            let profile = await service.GetProfile(data.id)



            const stats = await axios.get(`${DEVICES_URL}/devices-101-schedule?userId=${data.id}&password=${APP_SECRET}`);
            let myStats = stats.data;
            let output = {
                id: data.id,
                ...profile.data,
                totalDevices: myStats.totalDevices
            }
            delete output._id;
            console.log(output)
            return res.json(output);
        } catch (error) {
            return next(error);
        }
    }) */


    app.get('/data-feed', async (req, res, next) => {
        try {
            const user = BasicAuth(req);

            console.log(user)

            email = user.name.toLowerCase();

            const password = user.pass;

            if (email !== "admin@q-power.io" && password !== "8H1iI0g46XkwK?ICeX);^;") throw new ValidationError("Unauthorized user")
            // Fetch all users
            const allUsers = await service.getAllUsers();
            // Add device stats for each user
            const usersWithStats = await Promise.all(
                allUsers.map(async (user) => {
                    let userStats = { totalDevices: 0 };
                    try {
                        const stats = await axios.get(`${DEVICES_URL}/devices-101-schedule?userId=${user.id}&password=${APP_SECRET}`);
                        userStats = stats.data;
                    } catch (error) {
                        console.log(error)
                    }

                    return {
                        id: user._id,
                        name: user.name,
                        type: user.type,
                        email: user.email,
                        phone: user.phone,
                        totalDevices: userStats.totalDevices,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    };
                })
            );

            // Remove sensitive information if necessary
            usersWithStats.forEach(user => delete user._id);
            console.log(usersWithStats)
            // Send the response with all users and their stats
            return res.json(usersWithStats);
        } catch (error) {
            return next(error);
        }
    });



    app.get('/whoami', (req, res, next) => {
        return res.status(200).json({ msg: '/user : I am NordicScreen User Service' })
    })

    app.get('/test', (req, res, next) => {
        return res.status(200).json({ message: "I am test request" })
    })


}