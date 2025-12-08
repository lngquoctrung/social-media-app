const app = require("./app.config");
const env = require("./env.config");
const auth = require("./auth.config");
const database = require("./database.config");
const cookie = require("./cookie.config");
const uploader = require("./uploader.config");

const config = {
    app,
    env,
    auth,
    db: database,
    cookie,
    uploader,
};

module.exports = config;