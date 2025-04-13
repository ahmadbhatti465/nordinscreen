const { ValidateSignature } = require('../../utils');
const { AuthorizationError } = require('../../utils/errors/app-errors');

module.exports = async (req, res, next) => {
    try {
        if (req.url.includes("widget") && req.query.token && req.query.token != "") {
            return next();
        }
        const isAuthorized = await ValidateSignature(req);
        if (isAuthorized) {
            return next();
        }
        throw new AuthorizationError("Unauthorized user");
    } catch (error) {
        return next(error);
    }
}