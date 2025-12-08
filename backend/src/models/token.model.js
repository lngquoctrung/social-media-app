const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    refreshToken: {
        type: String,
        required: true
    },
    usedRefreshTokens: {
        type: Array,
        default: []
    }
}, {
    collection: "Tokens",
    timestamps: true
});

module.exports = mongoose.model("Token", tokenSchema);