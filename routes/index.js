const express = require('express');
const router = express.Router();

const userRouter = require('./userRoute');
const chatRoutes = require('./chatRoute');
const authRoutes = require('./authRoute');

router.use('/user', userRouter);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);  

module.exports = router;