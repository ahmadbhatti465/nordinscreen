const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

class BaseError extends Error {
    constructor(name, statusCode, description) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

//api Specific Errors
class APIError extends BaseError {
    constructor(description = "API Error") {
        super("API INTERNAL SERVER ERROR", STATUS_CODES.INTERNAL_SERVER_ERROR, description);
    }
}

//400
class ValidationError extends BaseError {
    constructor(description = "Bad Request") {
        super("BAD REQUEST", STATUS_CODES.BAD_REQUEST, description);
    }
}

//401 Authorization Error
class AuthorizationError extends BaseError {
    constructor(description = "ACCESS DENIED") {
        super("ACCESS DENIED", STATUS_CODES.UNAUTHORIZED, description);
    }
}

//404
class NotFoundError extends BaseError {
    constructor(description = "NOT FOUND") {
        super("NOT FOUND", STATUS_CODES.NOT_FOUND, description);
    }
}

module.exports = {
    APIError,
    AuthorizationError,
    ValidationError,
    NotFoundError
}