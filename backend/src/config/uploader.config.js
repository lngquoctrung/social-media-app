const path = require("path");

const avatar = {
    destination: path.join(__dirname, "../../public/images/avatars"),
    maxFileSize: 1024 * 1024 * 1,
    allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
}

const post = {
    destination: path.join(__dirname, "../../public/images/posts"),
    maxFileSize: 1024 * 1024 * 1,
    allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
    maxFiles: 10,
}

module.exports = {
    avatar,
    post
}