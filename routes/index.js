

const express = require('express');
const router = express.Router();

const redisRouter = require('./redis');
const userRouter = require('./user');
const chatRouter = require('./chat');

router.use('/redis', redisRouter);
router.use('/user', userRouter);
router.use('/chat', chatRouter);

module.exports = router;