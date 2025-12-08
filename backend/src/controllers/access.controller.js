const accessService = require("../services/access.service");
const { Ok, Created } = require("../core/success.response");
const config = require("../config");

const signUp = async (req, res) => {
    // Get user info from request body
    const { name, email, password } = req.body;

    // Handle signup
    const { code, metadata } = await accessService.signUp({ name, email, password });

    // Set tokens to cookie
    res.cookie("accessToken", metadata.accessToken, config.cookie.access);
    res.cookie("refreshToken", metadata.refreshToken, config.cookie.refresh);

    // Return response
    new Created({ message: "Register success", metadata }).send(res);
};

const login = async (req, res) => {
    // Get user info from request body
    const { email, password } = req.body;

    // Handle login
    const { code, metadata } = await accessService.login({ email, password });

    // Set tokens to cookie
    res.cookie("accessToken", metadata.accessToken, config.cookie.access);
    res.cookie("refreshToken", metadata.refreshToken, config.cookie.refresh);

    // Return response
    new Ok({ message: "Login success", metadata }).send(res);

}

const logout = async (req, res) => {
    // Get user id from request
    const storedKey = req.storedKey;

    // Handle logout
    await accessService.logout(storedKey);

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // Return response
    new Ok({ message: "Logout success" }).send(res);
};

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    // Handle refresh token
    const { code, metadata } = await accessService.refreshToken(refreshToken);

    // Set tokens to cookie
    res.cookie("accessToken", metadata.accessToken, config.cookie.access);
    res.cookie("refreshToken", metadata.refreshToken, config.cookie.refresh);

    // Return response
    new Ok({ message: "Refresh token success", metadata }).send(res);
};

module.exports = {
    login,
    logout,
    signUp,
    refreshToken
};