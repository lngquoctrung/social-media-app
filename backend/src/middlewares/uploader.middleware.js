const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const config = require("../config");
const { createFolder } = require("../utils/file.util");
const { BadRequestError } = require("../core/error.response");

const storage = multer.diskStorage({
	destination: async (req, file, cb) => {
		// Create temporary folder
		await createFolder(config.uploader.tempFolders.avatar);
		await createFolder(config.uploader.tempFolders.post);

		// Create main folder if not exist
		await createFolder(config.uploader.avatar.destination);
		await createFolder(config.uploader.post.destination);

		if (file.fieldname === "avatar-image") {
			cb(null, config.uploader.tempFolders.avatar);
		}
		else if (file.fieldname === "post-images") {
			cb(null, config.uploader.tempFolders.post);
		}
	},
	filename: (req, file, cb) => {
		const userId = req.user?.userId;
		const timestamp = Date.now();
		const randomStr = crypto.randomBytes(4).toString('hex');
		const ext = path.extname(file.originalname);

		cb(null, `${userId}-${timestamp}-${randomStr}-${file.fieldname}${ext}`);
	}
});

const fileFilter = (req, file, cb) => {
	// Check file style
	if (file.fieldname === "avatar-image") {
		if (!config.uploader.avatar.allowedFileTypes.includes(file.mimetype)) {
			return cb(new BadRequestError({ message: "Invalid file type" }));
		}
		cb(null, true);
	}
	else if (file.fieldname === "post-images") {
		if (!config.uploader.post.allowedFileTypes.includes(file.mimetype)) {
			return cb(new BadRequestError({ message: "Invalid file type" }));
		}
		cb(null, true);
	}
}

const avatarUploader = multer({
	storage,
	limits: {
		fileSize: config.uploader.avatar.maxFileSize,
	},
	fileFilter,
});

const postUploader = multer({
	storage,
	limits: {
		fileSize: config.uploader.post.maxFileSize,
	},
	fileFilter,
});

module.exports = {
	uploadAvatarImage: avatarUploader.single("avatar-image"),
	uploadPostImages: postUploader.array("post-images", config.uploader.post.maxFiles),
};