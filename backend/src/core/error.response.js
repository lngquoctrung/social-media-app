const { StatusCodes, ReasonPhrases } = require('./https.status.code');

class ErrorResponse extends Error {
    constructor({ message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, reasonStatusCode = ReasonPhrases.INTERNAL_SERVER_ERROR, metadata = {} }) {
        super(message);
        this.statusCode = statusCode;
        this.reasonStatusCode = reasonStatusCode;
        this.metadata = metadata;
    }
}

class BadRequestError extends ErrorResponse {
    constructor({ message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST, metadata }) {
        super({ message, statusCode, reasonStatusCode: ReasonPhrases.BAD_REQUEST, metadata });
    }
}

class AuthFailureError extends ErrorResponse {
    constructor({ message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED, metadata }) {
        super({ message, statusCode, reasonStatusCode: ReasonPhrases.UNAUTHORIZED, metadata });
    }
}

class ForbiddenError extends ErrorResponse {
    constructor({ message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN, metadata }) {
        super({ message, statusCode, reasonStatusCode: ReasonPhrases.FORBIDDEN, metadata });
    }
}

class NotFoundError extends ErrorResponse {
    constructor({ message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND, metadata }) {
        super({ message, statusCode, reasonStatusCode: ReasonPhrases.NOT_FOUND, metadata });
    }
}

module.exports = {
    ErrorResponse,
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError
}