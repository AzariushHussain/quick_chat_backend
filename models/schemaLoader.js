const mongoose = require('mongoose');
const { chatSchema, messageSchema } = require('./schemas/chatSchema');
const userSchema = require('./schemas/userSchema'); // Assuming you have a user schema defined in userSchema.js

const UserModel = mongoose.model('User', userSchema);
const ChatModel = mongoose.model('Chat', chatSchema);
const MessageModel = mongoose.model('Message', messageSchema);

module.exports = {
    UserModel,
    ChatModel,
    MessageModel,
};
