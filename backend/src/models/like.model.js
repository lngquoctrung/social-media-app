const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "targetType",
    },
    targetType: {
        type: String,
        required: true,
        enum: ["Post", "Comment"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    collection: "Likes",
    timestamps: true,
});

module.exports = mongoose.model("Like", likeSchema);