const fs = require("fs/promises");
const path = require("path");

const createFolder = async (folderPath) => {
    try {
        await fs.access(folderPath);
    } catch (error) {
        await fs.mkdir(folderPath, { recursive: true });
    }
}

const moveFile = async (oldPath, newPath) => {
    // Ensure destination folder exists
    const dirname = path.dirname(newPath);
    await createFolder(dirname);

    await fs.copyFile(oldPath, newPath);
    await fs.unlink(oldPath);
}

const removeFile = async (filePath) => {
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createFolder,
    moveFile,
    removeFile,
};