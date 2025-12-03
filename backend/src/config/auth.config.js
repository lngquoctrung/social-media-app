const { cleanEnv, str } = require("envalid");
const fs = require("fs");

const env = cleanEnv(process.env, {
    FRONT_END_URL: str(),
});

const auth = {
    ...env,
    JWT_PRIVATE_SECRET: fs.readFileSync("./keys/jwt.private.key"),
    JWT_PUBLIC_SECRET: fs.readFileSync("./keys/jwt.public.key"),
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",

}

const cookieConfig = {
    accessToken: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true trong production
        maxAge: 15 * 60 * 1000, // 15 phút
        path: '/',
        sameSite: 'strict',
    },
    refreshToken: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        path: '/', // Chỉ gửi cho routes auth
        sameSite: 'strict',
    },
};

module.exports = auth;