const express = require('express');
const { createWorkspace, getUserWorkspaces, getWorkspaceMembers } = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, createWorkspace);
router.get('/', protect, getUserWorkspaces);

// NEW: Route to get members of a specific workspace.
// The ':workspaceId' part acts as a variable.
router.get('/:workspaceId/members', protect, getWorkspaceMembers);

module.exports = router;

