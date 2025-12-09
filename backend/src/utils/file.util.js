const fs = require("fs");
const path = require("path");

const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

const moveFile = (oldPath, newPath) => {
    // Ensure destination folder exists
    const dirname = path.dirname(newPath);
    createFolder(dirname);

    fs.renameSync(oldPath, newPath);
}

module.exports = {
    createFolder,
    moveFile,
};