const app = require("./app.config");
const env = require("./env.config");
const auth = require("./auth.config");
const database = require("./database.config");

const config = {
    app,
    env,
    auth,
    db: database,
};

module.exports = config;