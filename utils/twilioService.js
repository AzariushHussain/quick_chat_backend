const twilio = require('twilio');
const { MESSAGE } = require('../utils/response');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

const createVerification = async (phone) => {
    try {
        const verification = await client.verify.v2
            .services(serviceSid)
            .verifications.create({
                channel: 'sms',
                to: phone,
            });
        return verification;
    } catch (err) {
        console.error(MESSAGE.ERROR_CREATING_VERIFICATION, err);
        throw err;
    }
};

const verifyOtp = async (phone, code) => {
    try {
        const verificationCheck = await client.verify.v2
            .services(serviceSid)
            .verificationChecks.create({
                to: phone,
                code: code,
            });
        return verificationCheck;
    } catch (err) {
        console.error(MESSAGE.ERROR_VERIFYING_OTP, err);
    }
};

module.exports = { createVerification, verifyOtp };
