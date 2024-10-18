const express = require('express');
const {getMessages, sendMessage, getContacts, createContact } = require('../controllers/chatController');
const verifyToken = require('../middlewares/auth');

const router = express.Router();
router.use(verifyToken);
// router.get('/users', getChats);
router.post('/create-chat', createContact);
router.get('/connected-users', getContacts);
router.get('/messages',getMessages);
router.post('/send-message', sendMessage);

module.exports = router;
