const express = require('express');
const {  verifyUserOtp, loginWithOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/verify-otp', verifyUserOtp);
router.post('/login', loginWithOtp);

module.exports = router;
