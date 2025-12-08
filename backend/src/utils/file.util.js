const fs = require("fs");

const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
}

module.exports = {
    createFolder,
};