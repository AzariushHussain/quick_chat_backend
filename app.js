require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectMongoDb = require('./connection');
const { setupWebSocket } = require('./utils/websocket');
const routes = require('./routes/index');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Fallback to localhost if FRONTEND_URL is not set
    credentials: true
}));
app.use(express.json());

// MongoDB connection
(async () => {
    try {
        await connectMongoDb.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit if unable to connect
    }
})();
// WebSocket setup
setupWebSocket(server);

// Route handling
app.use('/api', routes);

// Root route
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is working' });
});


// Start the server
const PORT = process.env.PORT || 8000; // Dynamic port from env or fallback
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
