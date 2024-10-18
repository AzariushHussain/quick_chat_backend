const express = require('express');
const verifyToken = require('../middlewares/auth');
const { getUser } = require('../controllers/userController');


const router = express.Router();
router.use(verifyToken);

router.get('/',getUser)

module.exports = router;