const { cleanEnv, str } = require("envalid");
const fs = require("fs");
const bcryptjs = require("bcryptjs");

const env = cleanEnv(process.env, {
    FRONT_END_URL: str(),
});

const auth = {
    ...env,
    JWT_PRIVATE_SECRET: fs.readFileSync("./keys/jwt.private.key"),
    JWT_PUBLIC_SECRET: fs.readFileSync("./keys/jwt.public.key"),
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    SALT_ROUNDS: bcryptjs.genSaltSync(10),
}

module.exports = auth;