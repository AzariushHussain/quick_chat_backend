const { Server } = require('socket.io');
const redis = require('redis');

const publisher = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

const subscriber = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

// Declare the Socket.IO instance variable here
let io;

(async () => {
    try {
        await publisher.connect();
        console.log(`Publisher connected to Redis server at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

        await subscriber.connect();
        console.log(`Subscriber connected to Redis server at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

        // Subscribe to multiple channels
        const channels = ['USER_STATUS', 'SEND_MESSAGE', 'TYPING'];
        await subscriber.subscribe(channels, (message, channel) => {
            console.log(`Received message from ${channel}: ${message}`);

            // Parse the message and handle based on the channel
            const parsedMessage = JSON.parse(message);
            handleIncomingMessage(channel, parsedMessage);
        });
    } catch (error) {
        console.error('Redis connection error:', error);
    }
})();

function handleIncomingMessage(channel, payload) {
    switch (channel) {
        case 'USER_STATUS':
            console.log(`User status update:`, payload);
            broadcastToWebSocketClients(channel, payload);
            break;
        case 'SEND_MESSAGE':
            console.log(`New message received:`, payload);
            broadcastToWebSocketClients(channel, payload);
            break;
        case 'TYPING':
            console.log(`Typing event:`, payload);
            broadcastToWebSocketClients(channel, payload);
            break;
        default:
            console.log(`Unhandled channel: ${channel}`);
    }
}

// Broadcast to WebSocket clients using Redis pub/sub
function broadcastToWebSocketClients(channel, payload) {
    if (io) {
        io.emit(channel, payload); // Broadcast to all connected clients
    }
}

// Function to publish events to Redis
async function publishEvent(channel, payload) {
    try {
        const message = JSON.stringify(payload);
        await publisher.publish(channel, message);
        console.log(`Event published to ${channel}: ${message}`);
    } catch (error) {
        console.error('Error publishing event:', error);
    }
}

// Export the publishEvent function and the setIo function
module.exports = { publishEvent, setIo: (socketIo) => { io = socketIo; } };
