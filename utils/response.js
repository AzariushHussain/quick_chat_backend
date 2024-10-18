
const successResponse = (res, message, data = {}, statusCode = 200) => {
    res.status(statusCode).json({
        status: true,
        message,
        data,
    });
};

const errorResponse = (res, message, statusCode = 500) => {
    res.status(statusCode).json({
        status: false,
        message,
    });
};

const MESSAGE = {
    ERROR_CREATING_CHAT: 'Error creating chat',
    ERROR_FETCHING_CHAT: 'Error fetching chat',
    ERROR_UPDATING_CHAT: 'Error updating chat',
    ERROR_DELETING_CHAT: 'Error deleting chat',
    ERROR_FETCHING_USERS: 'Error fetching users',
    ERROR_NOT_FOUND: 'Chat not found',
    ERROR_USER_NOT_FOUND: 'User not found',
    ERROR_MESSAGE_NOT_FOUND: 'Message not found',
    ERROR_INVALID_INPUT: 'Invalid input provided',
    SUCCESS_CHAT_CREATED: 'Chat created successfully',
    SUCCESS_CHAT_FETCHED: 'Chats fetched successfully',
    SUCCESS_CHAT_UPDATED: 'Chat updated successfully',
    SUCCESS_CHAT_DELETED: 'Chat deleted successfully',
    SUCCESS_MESSAGE_SENT: 'Message sent successfully',
    SUCCESS_MESSAGE_DELETED: 'Message deleted successfully',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    USER_NOT_FOUND:'User Not Found',
    PHONE_AND_CODE_REQUIRED:'Phone or code is Required',
    FAILED_TO_LOGIN:'Failed to Login',
    ALREADY_VERIFIED:'Already user verified',
    OTP_SENT:'OTP is sent',
    USERS_RETRIEVED: 'Users retrieved successfully.',
    USER_RETRIEVED: 'User retrieved successfully.',
    INTERNAL_SERVER_ERROR: 'An error occurred while processing your request.',
};


module.exports = { successResponse, errorResponse, MESSAGE };
