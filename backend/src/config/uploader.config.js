const path = require("path");

const tempFolders = {
    avatar: path.join(__dirname, "../../temp/avatars"),
    post: path.join(__dirname, "../../temp/posts"),
}

const avatar = {
    destination: path.join(__dirname, "../../public/images/avatars"),
    maxFileSize: 1024 * 1024 * 10,
    allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
}

const post = {
    destination: path.join(__dirname, "../../public/images/posts"),
    maxFileSize: 1024 * 1024 * 10,
    allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
    maxFiles: 10,
}

module.exports = {
    tempFolders,
    avatar,
    post,
}