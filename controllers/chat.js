const express = require('express');
const { Chat, Message } = require('../models/chat');
const  { responseMessages}  = require('../utils/constants');
const  formatMessage  = require('../utils/messageformatter');
const User = require('../models/user');
const { constants } = require('../utils/constants');

//chat apis

async function handleGetChats(req, res) {
    try {
        const { id } = req.user;
        const chats = await Chat.find({ users: id });
        return res.status(200).json({ chats });
    }
    catch (err) {
        console.error(err);
        const message = formatMessage(responseMessages.error.internalServerError);
        return res.status(500).json({ message});
    }
}

async function handleCreateChat(req, res) {
    try {
        const { id } = req.user;
        const { users, name } = req.body;
        users.push(id);
        const participants = await Promise.all(
            users.map(async (userId) => {                const user = await User.findOne({ _id: userId });

                return user;
            })
        );        
        if (users.length > 2) {
            const chat = new Chat({ 
                users: participants,
                type: constants.chat.type.GROUP,
                name: name,
            });
            await chat.save();
            return res.status(200).json({ chat });
        }
        else if(users.length === 2) {
            const participant = participants[0];
            const existingChat = await Chat.findOne({
                type: constants.chat.type.SINGLE,
                users: { $all: participants, $size: 2 } 
            });
            if (existingChat) {
                return res.status(200).json({ chat: existingChat });
            }
            const chat = new Chat({ 
                users: participants,
                type: constants.chat.type.SINGLE,
                name: ''
            });
            await chat.save();
            return res.status(200).json({ chat });
        }

    }
    catch (err) {
        console.error(err);
        const message = formatMessage(responseMessages.error.internalServerError);
        return res.status(500).json({ message });
    }
}

async function handleEditChat(req, res) {
    try {
        const { userId } = req.user;
        const { chatId, name, picture, participants } = req.body;
        const chat = await Chat.findOne({ _id: chatId });
        if (!chatId) {
            const message = formatMessage(responseMessages.error.invalidInput, { operation: 'Chat ID' });
            return res.status(400).json({ message });
        }
        if (name){
            const chat = await Chat.findOne({ _id: chatId});
            chat.name = name;
            await chat.save();
            return res.status(200).json({ chat });
        }
        if (picture){
            const chat = await Chat.findOne({ _id: chatId});
            chat.picture = picture;
            await chat.save();
            return res.status(200).json({ chat });
        }
        if (participants){
            chat.users.push(participants);
            await chat.save();
            return res.status(200).json({ chat });
        }
    }
    catch (err) {
        console.error(err);
        const message = formatMessage(responseMessages.error.internalServerError);
        return res.status(500).json({ message });
    }
};

async function handleDeleteChat(req, res) {
    try {
        const { userId } = req.user;
        const { chatId, participantPhone } = req.body;
        if (!chatId) {
            const message = formatMessage(responseMessages.error.invalidInput, { operation: 'Chat ID' });
            return res.status(400).json({ message });
        }
        const chat =await Chat.findOne({ _id: chatId });
        if (chat.type === constants.chat.type.SINGLE) {
            await Chat.deleteOne({ _id: chatId });
            const message = formatMessage(responseMessages.success.Deleted, { operation: 'Chat' });
            return res.status(200).json({ message });
        }
        else if (chat.type === constants.chat.type.GROUP) {
            const user = await User.findOne({ phone: participantPhone });
            if (!user) {
                const message = formatMessage(responseMessages.error.NotFound, { operation: 'User' });
                return res.status(404).json({ message });
            }
            chat.users = chat.users.filter((user) => user !== participantPhone);
            await chat.save();
            return res.status(200).json({ chat });
        }
    }
    catch (err) {
        console.error(err);
        const message = formatMessage(responseMessages.error.internalServerError);
        return res.status(500).json({ message });
    }
}


// message apis (no option to edit messages)

async function handleGetMessages(req, res) {    
    try {
        const { userId } = req.user;
        const { chatId } = req.body;
        const chat = await Chat.findOne({ _id: chatId });
        if (!chat) {
            const message = formatMessage(responseMessages.error.NotFound, { operation: 'Chat' });
            return res.status(404).json({ message });
        }
        else{
            const messages = await Message.find({ chatId: chatId });
            return res.status(200).json({ messages });
        }
    }
    catch (err) {
        console.error(err);
        const message = formatMessage(responseMessages.error.internalServerError);
        return res.status(500).json({ message });
    }
};

async function handleSendMessage(user, data) {
    try {
        const { userId } = user;
        const { chatId, type, data } = data;
        const chat = await Chat.findOne({ _id: chatId });
        if (!chat) {
            const message = formatMessage(responseMessages.error.NotFound, { operation: 'Chat' });
            return res.status(404).json({ message });
        }
        else {
            const message = new Message({
                user: userId,
                type: type,
                data: data,
                status: constants.message.status.SENT,
            });
            await message.save();
            chat.messages.push(message);
            return res.status(200).json({ message });
        }
    }
    catch (err) {
        console.error(err);
        const message = formatMessage(responseMessages.error.internalServerError);
        return res.status(500).json({ message });
    }
};


async function handleDeleteMessage(req, res) {
    try {
        const { userId } = req.user;
        const { messageId } = req.body;
        const message = await Message.findOne({ _id: messageId });
        if (!message) {
            const message = formatMessage(responseMessages.error.NotFound, { operation: 'Message' });
            return res.status(404).json({ message });
        }
        else if (message.user !== userId) {
            const message = formatMessage(responseMessages.error.invalidInput, { operation: 'Message' });
            return res.status(400).json({ message });
        }
        else {
            await Message.deleteOne({ _id: messageId });
            const message = formatMessage(responseMessages.success.Deleted, { operation: 'Message' });
            return res.status(200).json({ message });
        }
    }
    catch (err) {
        console.error(err);
        const message = formatMessage(responseMessages.error.internalServerError);
        return res.status(500).json({ message });
    }
}   


module.exports = { handleGetChats, handleCreateChat, handleEditChat, handleDeleteChat, handleGetMessages, handleSendMessage, handleDeleteMessage };