const { cleanEnv, str } = require("envalid");
const fs = require("fs");
const path = require("path");
const bcryptjs = require("bcryptjs");

const keysPath = path.join(__dirname, "..", "..", "keys");

const env = cleanEnv(process.env, {
    ALLOWED_URLS: str(),
});

const auth = {
    ...env,
    JWT_PRIVATE_SECRET: fs.readFileSync(path.join(keysPath, "jwt.private.key")),
    JWT_PUBLIC_SECRET: fs.readFileSync(path.join(keysPath, "jwt.public.key")),
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    SALT_ROUNDS: bcryptjs.genSaltSync(10),
}

module.exports = auth;