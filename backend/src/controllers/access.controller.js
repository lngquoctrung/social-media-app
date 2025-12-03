const userService = require("../services/user.service");
const { Ok } = require("../core/success.response");

const login = async (req, res) => {

}

const logout = async (req, res) => {

};

const signUp = async (req, res) => {
    // Get user info from request body
    const { fullName, email, password } = req.body;
    // Check user exist or not
    const user = await userService.findByEmail(email);

    new Ok({ message: "Register success", metadata: { fullName, email } }).send(res);
};

const refreshToken = async (req, res) => {

};

module.exports = {
    login,
    logout,
    signUp,
    refreshToken
};