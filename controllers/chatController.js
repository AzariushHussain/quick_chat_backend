const {
    getChatsForUser,
    createChat,
    findChat,
    deleteChat,
    getMessagesForChat,
    createMessage,
    deleteMessage,
} = require('../models/chatModel');
const { constants } = require('../utils/constants');
const { findUserById } = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/response');
const { MESSAGE } = require('../utils/response');

const getContacts = async (req, res) => {
    try {
        const { id } = req.user;
        const chats = await getChatsForUser(id);
        return successResponse(res, MESSAGE.SUCCESS_CHAT_FETCHED, chats);
    } catch (err) {
        console.error(err);
        return errorResponse(res, MESSAGE.INTERNAL_SERVER_ERROR);
    }
};

const createContact = async (req, res) => {
    try {
        console.log(req.body);
        const { id } = req.user;
        const { users, name } = req.body;
        users.push(id);

        const participants = await Promise.all(
            users.map(async (userId) => await findUserById(userId))
        );

        if (participants.length > 2) {
            const chat = await createChat(participants, name, constants.chat.type.GROUP);
            return successResponse(res, MESSAGE.SUCCESS_CHAT_CREATED, chat);
        } else if (participants.length === 2) {
            const existingChat = await findChat({
                type: constants.chat.type.SINGLE,
                users: { $all: participants, $size: 2 },
            });

            if (existingChat) {
                return successResponse(res, MESSAGE.SUCCESS_CHAT_FETCHED, existingChat);
            }

            const chat = await createChat(participants, '', constants.chat.type.SINGLE);
            return successResponse(res, MESSAGE.SUCCESS_CHAT_CREATED, chat);
        }
    } catch (err) {
        console.error(err);
        return errorResponse(res, MESSAGE.INTERNAL_SERVER_ERROR);
    }
};

// removed the deleteContact because deleting a chat object willl delete it for both users.

const getMessages = async (req, res) => {
    try {
        const { contactId } = req.query;
        const chat = await findChat({ _id: contactId });

        if (!chat) {
            return errorResponse(res, MESSAGE.ERROR_NOT_FOUND);
        }

        const messages = await getMessagesForChat(contactId);
        return successResponse(res, MESSAGE.SUCCESS_CHAT_FETCHED, messages);
    } catch (err) {
        console.error(err);
        return errorResponse(res, MESSAGE.INTERNAL_SERVER_ERROR);
    }
};

const sendMessage = async (req, res) => {
    try {
        const { id } = req.user;
        const { chatId, type, data } = req.body;

        const chat = await findChat({ _id: chatId });
        const user = await findUserById({ _id: id });
        if (!chat) {
            return errorResponse(res, MESSAGE.ERROR_NOT_FOUND);
        }

        const message = await createMessage({ chat, user,  type, data });
        return successResponse(res, MESSAGE.SUCCESS_MESSAGE_SENT, message);
    } catch (err) {
        console.error(err);
        return errorResponse(res, MESSAGE.INTERNAL_SERVER_ERROR);
    }
};

// removed deleteMessage because deleting a message object will delete it for both users.

module.exports = {
    getContacts,
    createContact,
    getMessages,
    sendMessage,
};
