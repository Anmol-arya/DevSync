const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    description: {
        type: String,
        trim: true,
        maxlength: 250
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // NEW: The Members Array
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Links to the User database
                required: true
            },
            role: {
                type: String,
                enum: ['Admin', 'Member', 'Viewer'], // Mongoose will strictly reject any other word
                default: 'Member'
            }
        }
    ]
}, { 
    timestamps: true 
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
module.exports = Workspace;



