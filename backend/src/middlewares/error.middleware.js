const multer = require("multer");
const { BadRequestError } = require("../core/error.response");

const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err instanceof multer.MulterError) {
        statusCode = 400;

        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                message = "File too large. Maximum size allowed";
                break;
            case "LIMIT_FILE_COUNT":
                message = "Too many files. Maximum number of files is 10";
                break;
            case "LIMIT_UNEXPECTED_FILE":
                message = "Field name is invalid or not allowed";
                break;
            case "LIMIT_PART_COUNT":
                message = "Too many parts in form";
                break;
            case "LIMIT_FIELD_KEY":
                message = "Field name is too long";
                break;
            case "LIMIT_FIELD_VALUE":
                message = "Field value is too long";
                break;
            case "LIMIT_FIELD_COUNT":
                message = "Too many fields";
                break;
            default:
                message = `Upload file error: ${err.message}`;
        }
    }

    console.error(`[ERROR] - ${statusCode} - ${message}`);
    console.error(err.stack);

    res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = errorMiddleware;