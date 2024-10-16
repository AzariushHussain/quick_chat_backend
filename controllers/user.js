const  { responseMessages }  = require('../utils/constants');
const  formatMessage  = require('../utils/messageformatter');
const { isValidIndianPhoneNumber } = require('../utils/phoneValidator');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { constants } = require('../utils/constants');

let otpAttempts = 0; 
const maxAttempts = 3; 
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;


async function  handleLogin(req, res) {
    try {
        const data = req.body;
        if (!isValidIndianPhoneNumber(data.phone)) {
            const message = formatMessage(responseMessages.error.invalidInput, { operation: 'Phone number' });
            return res.status(400).json({ message });
        }
        const existingUser = await User.findOne({ phone: data.phone });
        
        if (!existingUser) {
            const newUser = new User({
                username: data.username || '',
                phone: data.phone,
                about: data.about || constants.user.default.about,
                picture: data.picture || '', 
                status: constants.user.status.OFFLINE, 
                verified: false, 
            });
    
            await newUser.save(); 
            // use createVerification here
        }
        // console.log(`verification response obj: ${JSON.stringify(verification)}`);
        const message = formatMessage(responseMessages.success.Created, {operation: "OTP" });
        return res.status(200).json({ message });
    } catch (err) {
        console.error(err);
        const message = formatMessage(responseMessages.error.internalServerError);
        res.status(500).json({ message });
    }
}

async function handleVerifyOTP(req, res) {
    try{
        const { otp, phone } = req.body;
    if (otpAttempts >= maxAttempts) {
        const message = formatMessage(responseMessages.error.limitReached, { operation: 'OTP verification' });
        return res.status(400).json({ message});
    }

    // const isOtpValid = await verifyOtp(phone, otp)
    const isOtpValid = { status: 'approved' };

    if (isOtpValid.status === 'approved') {
        const user = await User.findOne({ phone });
        if (!user) {
            const message = formatMessage(responseMessages.error.NotFound, { operation: 'User' });
            return res.status(404).json({ message });
        }
        user.verified = true;
        await user.save();
        otpAttempts = 0; 
        const payload = { id: user._id };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        const message = formatMessage(responseMessages.success.operationSuccessful, { operation: 'OTP verification' });
        return res.json({ message, token, user });
    } else {
        otpAttempts++; 
        const message = formatMessage(responseMessages.error.invalidInput, { operation: 'OTP' });
        return res.status(400).json({ message });
    }
    }
    catch(err){
        console.error(err);
        const message = formatMessage(responseMessages.error.internalServerError);
        res.status(500).json({ message });
    }
}

async function handleGetUser(req, res) {
    const { phone , id} = req.query;
    let user = null;
    try {
        if (id){
             user = await User.findOne({ _id: id });
        }
        else{
             user = await User.findOne({ phone: phone });
        }
        if (user === null)
        {
            const users = await User.find();
            res.status(200).json({ users })

        }
        else{
            delete user.status;
            delete user.verified;
            res.status(200).json({ user })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(responseMessages.error.internalServerError);
    }
}


module.exports = 
{ 
    handleLogin,
    handleVerifyOTP,
    handleGetUser
}