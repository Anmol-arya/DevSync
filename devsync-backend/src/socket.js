const { Server } = require('socket.io');

let io; // This will hold our global socket instance

const initSocket = (server) => {
    // 1. Initialize the Socket server and allow React to connect
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Your React URL
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
    });

    // 2. Listen for new users connecting
    io.on('connection', (socket) => {
        console.log(`New user connected to WebSockets: ${socket.id}`);

        // 3. Listen for a user asking to join a specific workspace "Room"
        socket.on('joinWorkspace', (workspaceId) => {
            socket.join(workspaceId);
            console.log(`User ${socket.id} joined workspace room: ${workspaceId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

// A helper function so our controllers can use 'io' to send messages
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIO };


