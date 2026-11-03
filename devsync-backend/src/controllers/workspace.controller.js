const Workspace = require('../models/workspace.model');

// @desc    Create a new workspace
// @route   POST /api/workspaces
const createWorkspace = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Workspace name is required" });
        }

        // We create the workspace and instantly add the creator to the members list as an Admin
        const workspace = await Workspace.create({
            name,
            description,
            owner: req.user.userId,
            members: [
                {
                    user: req.user.userId,
                    role: 'Admin'
                }
            ]
        });

        res.status(201).json({
            message: "Workspace created successfully",
            workspace
        });
    } catch (error) {
        console.error("Create Workspace Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get all workspaces for the logged-in user
// @route   GET /api/workspaces
const getUserWorkspaces = async (req, res) => {
    try {
        // Find workspaces where the user is EITHER the owner OR inside the members array
        const workspaces = await Workspace.find({ 
            $or: [
                { owner: req.user.userId },
                { "members.user": req.user.userId }
            ]
        });
        
        res.status(200).json(workspaces);
    } catch (error) {
        console.error("Get Workspaces Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get all members of a specific workspace
// @route   GET /api/workspaces/:workspaceId/members
const getWorkspaceMembers = async (req, res) => {
    try {
        // req.params gets the ID directly from the URL (e.g., /api/workspaces/12345/members)
        const { workspaceId } = req.params;

        // Find the workspace
        const workspace = await Workspace.findById(workspaceId)
            // populate() swaps the fake user IDs in the members array with their real name and email!
            // We write 'name email' so it intentionally leaves out the password hash for security.
            .populate('members.user', 'name email'); 

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        // SECURITY CHECK: Is the person requesting this list actually a member of this workspace?
        const isMember = workspace.members.some(member => 
            member.user._id.toString() === req.user.userId
        );

        if (!isMember) {
            return res.status(403).json({ message: "You do not have permission to view this workspace" });
        }

        // Send back just the members array
        res.status(200).json(workspace.members);

    } catch (error) {
        console.error("Get Members Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createWorkspace, getUserWorkspaces, getWorkspaceMembers };

