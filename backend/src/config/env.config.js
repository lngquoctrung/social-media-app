const { cleanEnv, str, num } = require("envalid");

const env = cleanEnv(process.env, {
    HOST: str(),
    PORT: num(),
});

module.exports = env;
