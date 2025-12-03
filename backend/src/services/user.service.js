const bcryptjs = require("bcryptjs");
const userModel = require("../models/user.model");

class UserService {
    async getAllUsers() {
        return await userModel.find();
    }

    async createUser(user) {
        const { fullName, email, password } = user;
        try {
            const hashedPassword = await bcryptjs.hash(password, 10);
            return await userModel.create({ fullName, email, password: hashedPassword });
        } catch (err) {
            throw err;
        }
    }

    async updateUser(id, user) {
        return await userModel.findByIdAndUpdate(id, user);
    }

    async deleteUser(id) {
        return await userModel.findByIdAndDelete(id);
    }

    async getUserById(id) {
        return await userModel.findById(id);
    }
}

module.exports = new UserService();