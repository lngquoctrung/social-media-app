const { cleanEnv, str, num } = require("envalid");

const env = cleanEnv(process.env, {
    HOST: str(),
    PORT: num(),
    NODE_ENV: str(),
});

module.exports = env;
