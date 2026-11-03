const express = require('express');
// 1. Add deleteTask to the import
const { createTask, getWorkspaceTasks, updateTask, deleteTask } = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, createTask);
router.get('/workspace/:workspaceId', protect, getWorkspaceTasks);
router.patch('/:id', protect, updateTask);

// 2. Add the DELETE route
router.delete('/:id', protect, deleteTask);

module.exports = router;

