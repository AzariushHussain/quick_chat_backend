const mongoose = require('mongoose');
const { constants } = require('../../utils/constants');

const messageSchema = new mongoose.Schema({
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
        required: true,
    },
}, {
    timestamps: true,
});

const chatSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ],
    messages: [messageSchema],
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

module.exports = {
    chatSchema,
    messageSchema,
};
