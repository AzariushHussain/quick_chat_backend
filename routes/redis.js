const express = require('express');
const router = express.Router();
const { publishMessage } = require('../controllers/redis');

router.post('/publish', publishMessage);

module.exports = router;