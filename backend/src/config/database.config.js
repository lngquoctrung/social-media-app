const { cleanEnv, str, num } = require("envalid");

const database = cleanEnv(process.env, {
    DB_HOST: str(),
    DB_PORT: num(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
});

module.exports = database;
