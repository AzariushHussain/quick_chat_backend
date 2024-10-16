const jwt = require('jsonwebtoken'); 
const secret = process.env.JWT_SECRET; 

const authenticateToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return reject(err); 
            }
            resolve(decoded); 
        });
    });
};

module.exports = { authenticateToken };
