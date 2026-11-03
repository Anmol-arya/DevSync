const Task = require('../models/task.model');
const Workspace = require('../models/workspace.model');
const { getIO } = require('../socket'); // 1. Import our WebSocket engine

const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, workspaceId, assigneeId } = req.body;

        if (!title || !workspaceId) {
            return res.status(400).json({ message: "Title and Workspace ID are required" });
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        const isMember = workspace.members.some(member => member.user.toString() === req.user.userId);
        if (!isMember) return res.status(403).json({ message: "Not authorized" });

        const task = await Task.create({
            title, description, status: status || 'To Do', priority: priority || 'Medium',
            workspace: workspaceId, assignee: assigneeId || null, createdBy: req.user.userId
        });

        // 2. SOCKET BROADCAST: Tell everyone in this workspace room about the new task
        getIO().to(workspaceId.toString()).emit('taskCreated', task);

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getWorkspaceTasks = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        const isMember = workspace.members.some(member => member.user.toString() === req.user.userId);
        if (!isMember) return res.status(403).json({ message: "Not authorized" });

        const tasks = await Task.find({ workspace: workspaceId })
            .populate('assignee', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const workspace = await Workspace.findById(task.workspace);
        const isMember = workspace.members.some(member => member.user.toString() === req.user.userId);
        if (!isMember) return res.status(403).json({ message: "Not authorized" });

        if (status) task.status = status;
        await task.save();

        // 3. SOCKET BROADCAST: Tell everyone a task was updated
        getIO().to(task.workspace.toString()).emit('taskUpdated', task);

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const workspace = await Workspace.findById(task.workspace);
        const userMemberData = workspace.members.find(member => member.user.toString() === req.user.userId);
        
        if (!userMemberData) return res.status(403).json({ message: "Not authorized" });

        const isAdmin = userMemberData.role === 'Admin';
        const isCreator = task.createdBy.toString() === req.user.userId;

        if (!isAdmin && !isCreator) {
            return res.status(403).json({ message: "Permission denied." });
        }

        await Task.findByIdAndDelete(id);

        // 4. SOCKET BROADCAST: Tell everyone a task was deleted so it vanishes from their screens
        getIO().to(task.workspace.toString()).emit('taskDeleted', id);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createTask, getWorkspaceTasks, updateTask, deleteTask };