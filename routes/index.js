

const express = require('express');
const router = express.Router();

const redisRouter = require('./redis');
const userRouter = require('./user');
const chatRoutes = require('./chatRoute');
const authRoutes = require('./authRoute');
const { getAllUser } = require('../controllers/chatController');

router.get('/users',getAllUser);
router.use('/redis', redisRouter);
router.use('/user', userRouter);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);  

module.exports = router;