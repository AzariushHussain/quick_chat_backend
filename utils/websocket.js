const WebSocket = require('ws');
const { authenticateToken } = require('./websocketAuth');
const {
    getChatById,
    saveMessageToChat,
    broadcastMessageToChat
} = require('../service/chatService');
const clients = new Map(); 
const onlineUsers = new Set(); 

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });
    console.log('WebSocket server started on ws://localhost:8000');

    wss.on('connection', (ws) => {
        console.log('New client connected');

        // Handle incoming messages
        ws.on('message', async (message) => {
            let data;
            try {
                data = JSON.parse(message);
                console.log('Data received in socket:', data);
            } catch (error) {
                console.error('Error parsing message:', error);
                return;
            }

            if (data.message.type === 'auth') {
                const { token } = data;
                try {
                    const decoded = await authenticateToken(token);
                    clients.set(ws, decoded); // Store the client and associated user data
                    onlineUsers.add(decoded.id); // Add user to online users set
                    console.log('User authenticated:', decoded);

                    // Notify all clients of the new online user
                    broadcastUserStatus(decoded.id, true);
                } catch (err) {
                    console.error('JWT verification failed:', err);
                    ws.send(JSON.stringify({ error: 'Authentication failed' }));
                    ws.close();
                }
            } else {
                const user = clients.get(ws);
                if (!user) {
                    ws.send(JSON.stringify({ error: 'User not authenticated' }));
                    return;
                }

                // Process the incoming message
                if (data.message && data.chatId && data.token) {
                    try {
                        const decoded = await authenticateToken(data.token);
                        if (decoded.id !== user.id) {
                            ws.send(JSON.stringify({ error: 'Token mismatch' }));
                            return;
                        }

                        // Save the message to the chat in the database
                        const newMessage = await saveMessageToChat(data.chatId, decoded.id, data.message);

                        // Send the message back as a response to the sender
                        ws.send(JSON.stringify({ type: 'message', message: newMessage }));

                        // Broadcast the message to the other user in the chat
                        broadcastToChatUsers(data.chatId, newMessage, decoded.id);

                        // Publish the message for other connected WebSocket servers
                        publishMessageToOtherServers(newMessage);
                    } catch (error) {
                        console.error('Error processing message:', error);
                        ws.send(JSON.stringify({ error: 'Error processing message' }));
                    }
                }
            }
        });

        // Handle client disconnection
        ws.on('close', () => {
            console.log('Client disconnected');
            const user = clients.get(ws);
            if (user) {
                onlineUsers.delete(user.id); // Remove user from online users set
                broadcastUserStatus(user.id, false); // Notify all clients of the user going offline
            }
            clients.delete(ws); // Remove the client from the clients map
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    return wss;
}

// Function to broadcast user online/offline status to all clients
const broadcastUserStatus = (userId, isOnline) => {
    const statusMessage = JSON.stringify({ type: 'userStatus', userId, isOnline });
    clients.forEach((_, client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(statusMessage);
        }
    });
}

// Function to broadcast a message to all users in a chat
const broadcastToChatUsers = (chatId, message, senderId) => {
    clients.forEach((user, client) => {
        if (user.chatId === chatId && user.id !== senderId && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message', message }));
        }
    });
}

// Function to publish the message to other WebSocket servers
const publishMessageToOtherServers = (message) => {
    // Implement your Redis or other pub/sub logic here
    console.log('Publishing message to other servers:', message);
}

module.exports = { setupWebSocket, clients };
