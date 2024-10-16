const express = require('express');
const router = express.Router();
const { handleGetChats, handleCreateChat, handleEditChat, handleDeleteChat, handleGetMessages, handleSendMessage, handleDeleteMessage } = require('../controllers/chat');
const verifyToken = require('../middlewares/auth');

// chat routes
router.use(verifyToken);
router
    .route('/')
    .get(handleGetChats)
    .post(handleCreateChat)
    .put(handleEditChat)
    .delete(handleDeleteChat);

    

// message routes

router
    .route('/messages')
    .get(handleGetMessages)
    .post(handleSendMessage)
    .delete(handleDeleteMessage);

module.exports = router;