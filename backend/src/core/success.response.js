const { StatusCodes, ReasonPhrases } = require('./https.status.code');

class SuccessResponse {
    constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.reasonStatusCode = reasonStatusCode;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res, header = {}) {
        return res.status(this.statusCode).json({
            status: this.reasonStatusCode.toLowerCase(),
            code: this.statusCode,
            message: this.message,
            metadata: this.metadata,
        });
    }
}

class Ok extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class Created extends SuccessResponse {
    constructor({ message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata });
    }
}

module.exports = {
    Ok,
    Created,
    SuccessResponse,
}