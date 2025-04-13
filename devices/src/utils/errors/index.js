// const Sentry = require("@sentry/node");
// const _ = require("@sentry/tracing");
const {
    NotFoundError,
    ValidationError,
    AuthorizationError,
} = require("./app-errors");

// Sentry.init({
//     dsn: "https://c8d2b1bbd2a74443c80123eed78ff08d@o4507056753344512.ingest.us.sentry.io/4507056760029184",
//     tracesSampleRate: 1.0,
// });

module.exports = (app) => {
    app.use((error, req, res, next) => {
        let reportError = true;

        // skip common / known errors
        [NotFoundError, ValidationError, AuthorizationError].forEach((typeOfError) => {
            if (error instanceof typeOfError) {
                reportError = false;
            }
        });

        // if (reportError) {
        //     console.log("Reporting to Sentry")
        //     Sentry.captureException(error);
        // }
        console.log(error);
        const statusCode = error.statusCode || 500;
        const data = error.data || error.message;
        return res.status(statusCode).json({success: false, data: data});
    });
};
