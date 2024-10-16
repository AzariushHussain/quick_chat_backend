const express = require('express');
const router = express.Router();
const { handleLogin, handleVerifyOTP, handleGetUser } = require('../controllers/user');
const verifyToken = require('../middlewares/auth');

router.post('/login',handleLogin);
router.post('/verify', handleVerifyOTP);
router.get('/',verifyToken, handleGetUser)

module.exports = router;