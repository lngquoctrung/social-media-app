const mongoose = require("mongoose")
const config = require("../config")

const mongo_uri = `mongodb://${config.db.DB_USER}:${config.db.DB_PASSWORD}@${config.db.DB_HOST}:${config.db.DB_PORT}/${config.db.DB_NAME}?authSource=admin`
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongo_uri);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(`Error when trying to connect database: ${err.message}`);
    }
}

module.exports = connectDB;