const bcryptjs = require("bcryptjs");
const config = require("../config");

const hashPassword = async (password) => {
    try {
        return await bcryptjs.hash(password, config.auth.SALT_ROUNDS);
    } catch (err) {
        throw err;
    }
}

const comparePassword = async (password, hashPassword) => {
    try {
        return await bcryptjs.compare(password, hashPassword);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    hashPassword,
    comparePassword
}