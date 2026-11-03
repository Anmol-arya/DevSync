require('dotenv').config();



const http = require('http'); 


const app = require('./app'); // Path fixed: ./app instead of ./src/app
const connectDB = require('./config/db'); // Path fixed
const { initSocket } = require('./socket'); // Path fixed

const PORT = process.env.PORT || 5000;

// 1. Connect to MongoDB
connectDB();

// 2. Wrap Express inside a standard HTTP server
const server = http.createServer(app);

// 3. Attach Socket.io to that HTTP server
initSocket(server);

// 4. IMPORTANT: Start the server using server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebSocket Engine Initialized.`);
});



