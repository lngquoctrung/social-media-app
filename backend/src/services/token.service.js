const tokenModel = require("../models/token.model");

class TokenService {
    createToken = async ({ userId, token }) => {
        try {
            // Check user exist or not
            const filter = { user: userId }
            const update = {
                refreshToken: token,
                usedRefreshTokens: [] // Reset if user login again
            }
            const options = { upsert: true, new: true }
            // If user does not exist, then insert new row
            const tokenDoc = await tokenModel.findOneAndUpdate(filter, update, options);
            return tokenDoc;
        } catch (err) {
            throw err;
        }
    }

    findByUserId = async (userId) => {
        return await tokenModel.findOne({ user: userId });
    }

    deleteTokenById = async (id) => {
        return await tokenModel.deleteOne({ _id: id });
    }

    findByRefreshTokenUsed = async (refreshToken) => {
        return await tokenModel.findOne({ usedRefreshTokens: refreshToken });
    }

    deleteTokenByUserId = async (userId) => {
        return await tokenModel.deleteOne({ user: userId });
    }

    findByRefreshToken = async (refreshToken) => {
        return await tokenModel.findOne({ refreshToken });
    }
}

module.exports = new TokenService();
