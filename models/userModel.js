
const { UserModel } = require('./schemaLoader'); // Import models from schemaLoader

const createUser = async (userData) => {
    const user = new UserModel(userData);
    return await user.save();
};

const findUserByPhone = async (phone) => {
    return await UserModel.findOne({ phone });
};

const updateUserStatus = async (userId, status) => {
    return await UserModel.findByIdAndUpdate(userId, { status }, { new: true });
};

const verifyUser = async (userId) => {
    return await UserModel.findByIdAndUpdate(userId, { verified: true }, { new: true });
};

module.exports = {createUser, findUserByPhone, updateUserStatus, verifyUser };
