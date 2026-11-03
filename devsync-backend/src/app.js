const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes'); 
const workspaceRoutes = require('./routes/workspace.routes');
const taskRoutes = require('./routes/task.routes'); // 1. Import Task Routes

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes); // 2. Register the tasks endpoint

module.exports = app;



