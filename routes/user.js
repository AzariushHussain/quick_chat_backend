const express = require('express');
const verifyToken = require('../middlewares/auth');
const { handleLogin, handleVerifyOTP, handleGetUser } = require('../controllers/user');


const router = express.Router();
router.use(verifyToken)
router.get('/',verifyToken, handleGetUser)

module.exports = router;