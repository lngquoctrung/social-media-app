require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Config
const config = require("./config");
const connectDB = require("./loaders/mongodb.loader");

// Middlewares
const errorMiddleware = require("./middlewares/error.middleware");
const { NotFoundError } = require("./core/error.response");

// Initialize server
const app = express();
const apiPath = `/${config.app.API_PREFIX}/${config.app.API_VERSION}`;

// Public router
app.use(`${apiPath}/public`, express.static(path.join(__dirname, "..", "public")));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
        // origin: config.auth.FRONT_END_URL,
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["set-cookie"],
    })
);

// Routes
app.use(apiPath, require("./routers/index"));
app.use((req, res, next) => next(new NotFoundError({ message: "Resource not found" })));

// Error middleware
app.use(errorMiddleware);

try {
    app.listen(config.env.PORT, config.env.HOST, async () => {
        console.clear();
        await connectDB();
        console.log(`The server name: ${config.app.APP_NAME}`);
        console.log(`Server is running on http://${config.env.HOST}:${config.env.PORT}`);
    });
} catch (err) {
    console.error(`Cannot start server: ${err.message}`);
    process.exit(1);
}
