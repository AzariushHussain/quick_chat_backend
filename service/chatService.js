const { Chat, Message } = require('../models/chat');
const { User } = require('../models/user');

/**
 * Fetches a chat by its ID.
 * @param {number} chatId - The ID of the chat to fetch.
 * @returns {Promise<Object>} The chat object with its associated messages and users.
 */
const getChatById = async (chatId) => {
    try {
        const chat = await db.Chat.findOne({ _id: chatId });

        if (!chat) {
            throw new Error('Chat not found');
        }

        return chat;
    } catch (error) {
        console.error('Error fetching chat:', error);
        throw error; // Let the calling function handle the error
    }
};

/**
 * Saves a new message to a chat.
 * @param {number} chatId - The ID of the chat where the message should be added.
 * @param {number} userId - The ID of the user sending the message.
 * @param {Object} messageData - The message object containing type and text.
 * @returns {Promise<Object>} The newly created message object.
 */
const saveMessageToChat = async (chatId, userId, messageData) => {
    try {
        // Validate that the chat exists
        const chat = await getChatById(chatId);
        if (!chat) {
            throw new Error('Chat does not exist');
        }

        // Create and save the message
        // const user = await User.findOne
        // const newMessafe = new Message({
        //     user : userId,

        // });
        const newMessage = await db.Message.create({
            chatId,
            userId,
            type: messageData.type,
            text: messageData.message,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return newMessage;
    } catch (error) {
        console.error('Error saving message:', error);
        throw error; // Let the calling function handle the error
    }
};

/**
 * Broadcasts a message to all users in the chat except the sender.
 * @param {WebSocket.Server} wss - The WebSocket server instance.
 * @param {number} chatId - The chat ID.
 * @param {Object} message - The message object to broadcast.
 * @param {number} senderId - The ID of the user who sent the message.
 */
const broadcastMessageToChat = (wss, chatId, message, senderId) => {
    wss.clients.forEach((client) => {
        const clientUser = clients.get(client);

        if (
            clientUser &&
            clientUser.id !== senderId && // Don't send the message to the sender
            clientUser.chatIds.includes(chatId) && // Ensure the client is in the same chat
            client.readyState === WebSocket.OPEN
        ) {
            client.send(JSON.stringify({
                type: 'newMessage',
                message
            }));
        }
    });
};

module.exports = {
    getChatById,
    saveMessageToChat,
    broadcastMessageToChat
};
