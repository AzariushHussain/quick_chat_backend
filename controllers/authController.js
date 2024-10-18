const { createUser, findUserByPhone } = require('../models/userModel');
const { successResponse, errorResponse ,MESSAGE} = require('../utils/response');
const { constants } = require('../utils/constants');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

const verifyUserOtp = async (req, res) => {
    const { phone, code } = req.body;

    try {

        if (!phone || !code) {
            return errorResponse(res, MESSAGE.PHONE_AND_CODE_REQUIRED, 400);  // Return 400 Bad Request if validation fails
        }

        const user = await findUserByPhone(phone);
        
        if (user) {
            // const verificationResult = await verifyOtp(phone, code);
            const verificationResult = {status:"approved"};
            if(!verificationResult) return errorResponse(res, MESSAGE.FAILED_TO_LOGIN, 200);
            if (verificationResult.status === 'approved') {

                const payload = { id: user._id };
                const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
                successResponse(res, MESSAGE.OTP_VERIFIED,{token,user});

            } else {
                errorResponse(res, MESSAGE.INVALID_OTP, 400);
            }
        } else {
            errorResponse(res, MESSAGE.USER_NOT_FOUND, 404);
        }
        
    } catch (err) {
        console.error(err);
        errorResponse(res, MESSAGE.ERROR_VERIFYING_OTP);
    }
};

const loginWithOtp = async (req, res) => {
    const { phone } = req.body;

    try {

        let user = await findUserByPhone(phone);
        if (!user) {
            user = await createUser({
                phone: phone,
                verified: false, 
                status: constants.user.status.OFFLINE, 
                about: constants.user.default.about, 
            });
        }
        return successResponse(res, MESSAGE.OTP_SENT);

    } catch (err) {
        console.error(err);
        return errorResponse(res, MESSAGE.ERROR_LOGIN);
    }
};

module.exports = { verifyUserOtp, loginWithOtp };
