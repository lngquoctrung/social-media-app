const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`[ERROR] - ${statusCode} - ${message}`);

    res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
}

module.exports = errorMiddleware;