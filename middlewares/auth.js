const jwt = require('jsonwebtoken');
const  { responseMessages } = require('../utils/constants');
const  formatMessage  = require('../utils/messageformatter');

const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        const message = formatMessage(responseMessages.error.NotFound, { operation: 'Token' });
        return res.status(401).json({ message});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log('decoded:',decoded);
        next();
    }
    catch (err) {
        const message = formatMessage(responseMessages.error.invalidInput, {operation: 'Token'})
        console.log('inside error messsage:',message);
        res.status(400).json({ message });
    }
};

module.exports = verifyToken;
