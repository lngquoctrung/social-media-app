const userModel = require("../models/user.model");
const tokenService = require("./token.service");
const config = require("../config");
const httpStatusCode = require("../core/https.status.code");
const { BadRequestError, ForbiddenError, AuthFailureError } = require("../core/error.response");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { signToken, verifyToken } = require("../utils/jwt.util");

class AccessService {
    signUp = async ({ name, email, password }) => {
        // Check user exist or not
        const holderUser = await userModel.findOne({ email }).lean();
        if (holderUser) {
            throw new BadRequestError({ message: "User already exists" });
        }

        // Hasb password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = await userModel.create({
            name, email, password: hashedPassword
        });

        if (newUser) {
            // Create access token and refresh token
            const accessToken = await signToken({ userId: newUser._id, email, role: newUser.role }, config.auth.JWT_ACCESS_EXPIRES_IN);
            const refreshToken = await signToken({ userId: newUser._id, email, role: newUser.role }, config.auth.JWT_REFRESH_EXPIRES_IN);

            // Create token in database
            const storedKey = await tokenService.createToken({ userId: newUser._id, token: refreshToken });

            if (!storedKey) {
                throw new BadRequestError({ message: "Failed to create token" });
            }

            // Return response
            return {
                code: httpStatusCode.StatusCodes.CREATED,
                metadata: {
                    user: {
                        _id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role
                    },
                    accessToken,
                    refreshToken,
                }
            }
        }
        return {
            code: httpStatusCode.StatusCodes.OK,
            metadata: null
        }
    }

    login = async ({ email, password }) => {
        // Check user exist?
        const foundUser = await userModel.findOne({ email });
        if (!foundUser) throw new BadRequestError({ message: "Email not found" });

        // Check password
        const isMatch = await comparePassword(password, foundUser.password);
        if (!isMatch) throw new BadRequestError({ message: "Password is wrong" });

        // Create access token and refresh token
        const accessToken = await signToken({ userId: foundUser._id, email, role: foundUser.role }, config.auth.JWT_ACCESS_EXPIRES_IN);
        const refreshToken = await signToken({ userId: foundUser._id, email, role: foundUser.role }, config.auth.JWT_REFRESH_EXPIRES_IN);

        // Create token in database
        const storedKey = await tokenService.createToken({ userId: foundUser._id, token: refreshToken });

        if (!storedKey) {
            throw new BadRequestError({ message: "Failed to create token" });
        }

        // Return response
        return {
            code: httpStatusCode.StatusCodes.OK,
            metadata: {
                user: {
                    _id: foundUser._id,
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role
                },
                accessToken,
                refreshToken,
            }
        }
    }

    logout = async (storedKey) => {
        const deletedKey = await tokenService.deleteTokenById(storedKey._id);
        if (!deletedKey) throw new BadRequestError({ message: "Failed to delete token" });
        return deletedKey;
    }

    refreshToken = async (refreshToken) => {
        // Check token used or not
        const foundToken = await tokenService.findByRefreshTokenUsed(refreshToken);

        // Require user login again when detect doubt
        if (foundToken) {
            const { userId } = await verifyToken(refreshToken);
            // Remove token from database
            await tokenService.deleteTokenByUserId(userId);
            // Require user login again
            throw new ForbiddenError({ message: "Suspicious event detected! Please log in again" })
        }

        // Token never has used
        const holderToken = await tokenService.findByRefreshToken(refreshToken);
        if (!holderToken) throw new AuthFailureError({ message: "Token is not found " });

        // Verify token
        const { email } = await verifyToken(refreshToken);

        // Check user exist or not
        const foundUser = await userModel.findOne({ email });
        if (!foundUser) throw new AuthFailureError({ message: "User not found" });

        // Create access token and refresh token
        const newAccessToken = await signToken({ userId: foundUser._id, email, role: foundUser.role }, config.auth.JWT_ACCESS_EXPIRES_IN);
        const newRefreshToken = await signToken({ userId: foundUser._id, email, role: foundUser.role }, config.auth.JWT_REFRESH_EXPIRES_IN);

        // Update token: add current token to used array and update new token
        await holderToken.updateOne({
            $set: {
                refreshToken: newRefreshToken,
            },
            $addToSet: {
                usedRefreshTokens: refreshToken
            }
        });

        // Return response
        return {
            code: httpStatusCode.StatusCodes.OK,
            metadata: {
                user: {
                    _id: foundUser._id,
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role
                },
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            }
        }
    }
}

module.exports = new AccessService();