const { publishEvent } = require("./redis");


const registerSocket = (io) => 
    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);
    
        // Notify others that the user is online
        socket.on('user_status', (userStatus) => {
            const data = JSON.parse(userStatus);
            const { userId } =  data
            socket.userId = userId;
            socket.broadcast.emit('user_status', data);
            publishEvent('user_status', data);
        })
    
        // When a client sends a message
        socket.on('send_message', (message) => {
            // Broadcast the message to all clients except the sender
            const data = JSON.parse(message);
            socket.broadcast.emit('receive_message', {
                message: data.data,
                userId: data.userId, // Attach user ID from the socket
                chatId: data.chatId, // Include chat ID for context
                timestamp: new Date() // Optional timestamp for the message
            });
            publishEvent('receive_message', {
                message: data.data,
                userId: data.userId, // Attach user ID from the socket
                chatId: data.chatId, // Include chat ID for context
                timestamp: new Date() // Optional timestamp for the message
            });
    
            console.log(`Message from ${socket.userId}: ${message.data}`);
        });
    
        // Handle typing event
        socket.on('typing', () => {
            // Broadcast typing status to other clients in the same chat
            socket.broadcast.emit('user_typing', {
                userId: socket.userId,
                typing: true, // Indicate that the user is typing
            });
            publishEvent('user_typing', {
                userId: socket.userId,
                typing: true, // Indicate that the user is typing
            });
    
            // Optionally indicate when typing stops
            setTimeout(() => {
                socket.broadcast.emit('user_typing', {
                    userId: socket.userId,
                    typing: false, // Indicate that the user has stopped typing
                });
                publishEvent('user_typing', {
                    userId: socket.userId,
                    typing: true, // Indicate that the user is typing
                });
            }, 3000); // Example timeout of 3 seconds
        });
    
        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log(`User ${socket.userId} disconnected`);
            // Notify others that the user is offline
            socket.broadcast.emit('user_offline', { userId: socket.userId });
        });
    });
    


module.exports = { registerSocket };