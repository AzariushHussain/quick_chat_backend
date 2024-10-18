const mongoose = require('mongoose');
const { constants } = require('../../utils/constants');


const chatSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ],
    type: {
        type: String,
        enum: [constants.chat.type.SINGLE, constants.chat.type.GROUP],
        required: true,
        default: constants.chat.type.SINGLE,
    },
    name: {
        type: String,
    },
    picture: {
        type: String,
    },
}, {
    timestamps: true,
});



const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat', 
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: [
            constants.message.type.TEXT,
            constants.message.type.IMAGE,
            constants.message.type.VIDEO,
            constants.message.type.AUDIO,
            constants.message.type.DOCUMENT
        ],
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            constants.message.status.SENT,
            constants.message.status.DELIVERED,
            constants.message.status.READ
        ],
        default: constants.message.status.SENT,
        required: true,
    },
}, {
    timestamps: true,
});


module.exports = {
    chatSchema,
    messageSchema,
};
