const mongoose = require('mongoose');

// Define the blueprint for our User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Removes accidental spaces like " Anmol " -> "Anmol"
    },
    email: {
        type: String,
        required: true,
        unique: true, // Prevents two users from registering with the same email
        trim: true,
        lowercase: true // Converts "Anmol@Email.com" to "anmol@email.com"
    },
    password: {
        type: String,
        required: true
    }
}, { 
    // This automatically creates 'createdAt' and 'updatedAt' fields
    timestamps: true 
});

// Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;