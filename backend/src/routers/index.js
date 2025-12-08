const express = require("express");
const config = require("../config");
const router = express.Router();

// Impprt child routers
const accessRouter = require("./v1/access.router");
const userRouter = require("./v1/user.router");
const postRouter = require("./v1/post.router");
// const commentRouter = require("./v1/comment.router");
const { Ok } = require("../core/success.response");

// Define specified endpoint for each child router
router.use("/access", accessRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);
// router.use("/comments", commentRouter);
router.get("/", (req, res) => {
    new Ok({
        message: "Welcome to the Social Media API",
        metadata: {
            appName: config.app.APP_NAME,
            appVersion: config.app.APP_VERSION,
            apiPrefix: config.app.API_PREFIX,
            apiVersion: config.app.API_VERSION,
        }
    }).send(res);
});

module.exports = router;
