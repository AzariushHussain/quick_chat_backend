
const { UserModel } = require('./schemaLoader'); // Import models from schemaLoader

const createUser = async (userData) => {
    const user = new UserModel(userData);
    return await user.save();
};

const findUserByPhone = async (phone) => {
    return await UserModel.findOne({ phone });
};

const findUserById = async (id) => {
    return await UserModel.findOne({ _id: id });
};

const findAllUsers = async () => {
    return await UserModel.find();
};  

const updateUserStatus = async (userId, status) => {
    return await UserModel.findByIdAndUpdate(userId, { status }, { new: true });
};

const verifyUser = async (userId) => {
    return await UserModel.findByIdAndUpdate(userId, { verified: true }, { new: true });
};

module.exports = {createUser, findUserByPhone, findUserById, findAllUsers, updateUserStatus, verifyUser };
