const {
    getChatsForUser,
    createChat,
    findChat,
    deleteChat,
    getMessagesForChat,
    createMessage,
    deleteMessage,
} = require('../models/chatModel');
const { UserModel } = require('../models/schemaLoader');

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
        const { id } = req.user;
        const { users, name } = req.body;
        users.push(id);

        const participants = await Promise.all(
            users.map(async (userId) => await User.findOne({ _id: userId }))
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

const deleteContact = async (req, res) => {
    try {
        const { chatId } = req.body;
        if (!chatId) {
            return errorResponse(res, MESSAGE.ERROR_INVALID_INPUT);
        }

        const chat = await findChat({ _id: chatId });

        if (!chat) {
            return errorResponse(res, MESSAGE.ERROR_NOT_FOUND);
        }

        if (chat.type === constants.chat.type.SINGLE) {
            await deleteChat(chatId);
            return successResponse(res, MESSAGE.SUCCESS_CHAT_DELETED);
        } else if (chat.type === constants.chat.type.GROUP) {
            // Assuming req.body.participantPhone exists and logic to handle participant removal is correct.
            chat.users = chat.users.filter((user) => user !== req.body.participantPhone);
            await chat.save();
            return successResponse(res, MESSAGE.SUCCESS_CHAT_UPDATED, chat);
        }
    } catch (err) {
        console.error(err);
        return errorResponse(res, MESSAGE.INTERNAL_SERVER_ERROR);
    }
};

const getMessages = async (req, res) => {
    try {
        const { contactId } = req.body;
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
        const { userId } = req.user;
        const { chatId, type, data } = req.body;

        const chat = await findChat({ _id: chatId });
        if (!chat) {
            return errorResponse(res, MESSAGE.ERROR_NOT_FOUND);
        }

        const message = await createMessage({ user: userId, chatId, type, data });
        chat.messages.push(message);
        await chat.save();

        return successResponse(res, MESSAGE.SUCCESS_MESSAGE_SENT, message);
    } catch (err) {
        console.error(err);
        return errorResponse(res, MESSAGE.INTERNAL_SERVER_ERROR);
    }
};

const deleteMsg = async (req, res) => {
    try {
        const { messageId } = req.body;
        const message = await findChat({ _id: messageId });

        if (!message) {
            return errorResponse(res, MESSAGE.ERROR_MESSAGE_NOT_FOUND);
        }

        await deleteMessage(messageId);
        return successResponse(res, MESSAGE.SUCCESS_MESSAGE_DELETED);
    } catch (err) {
        console.error(err);
        return errorResponse(res, MESSAGE.INTERNAL_SERVER_ERROR);
    }
};

const getAllUser = async (req, res) => {
    const { phone, id } = req.query;

    try {
        let user = null;

        if (id) {
            user = await UserModel.findById(id).lean();
        } else if (phone) {
            user = await UserModel.findOne({ phone }).lean();
        }

        if (!user) {
            const users = await UserModel.find().lean();
            return successResponse(res, MESSAGE.USERS_RETRIEVED, { users });
        }

        const { status, verified, ...userWithoutSensitiveInfo } = user;

        return successResponse(res, MESSAGE.USER_RETRIEVED, { user: userWithoutSensitiveInfo });

    } catch (err) {
        console.error(err);
        return errorResponse(res, MESSAGE.INTERNAL_SERVER_ERROR);
    }
};
module.exports = {
    getContacts,
    createContact,
    deleteContact,
    getMessages,
    sendMessage,
    deleteMsg,
    getAllUser
};
