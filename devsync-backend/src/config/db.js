const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect using the hidden URL from our .env file
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Database Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1); // Stop the server if the database fails
    }
};

module.exports = connectDB;

