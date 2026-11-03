const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true
    },
    // The Kanban columns
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'In Review', 'Done'],
        default: 'To Do'
    },
    // Task importance
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    // Which workspace does this task live inside?
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    // Who is responsible for completing this task?
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Can be unassigned initially
    },
    // Who originally wrote this task?
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt dates
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

