const { ValidateSignatureSocket } = require('../../utils');
const { AuthorizationError } = require('../../utils/errors/app-errors');

module.exports = async (socket, next) => {
    try {
        //console.log("Auth middleware")
        const isAuthorized = await ValidateSignatureSocket(socket);
        if (isAuthorized) {
            //console.log("Authorized user")
            return next();
        }
        throw new AuthorizationError("Unauthorized user");
    } catch (error) {
        return next(error);
    }
}