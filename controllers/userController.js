const {findUserByPhone,  findUserById, findAllUsers} = require('../models/userModel');
const { successResponse, errorResponse ,MESSAGE} = require('../utils/response');


async function getUser(req, res) {
    const { phone , id} = req.query;
    let user = null;
    try {
        if (id){
             user = await findUserById(id);
        }
        else{
             user = await findUserByPhone(phone);
        }
        if (user === null)
        {
            const users = await findAllUsers()
            successResponse(res, MESSAGE.USERS_RETRIEVED, { users });

        }
        else{
            successResponse(res, MESSAGE.USER_RETRIEVED, { user });
        }
    } catch (err) {
        console.log(err);
        errorResponse(res, MESSAGE.ERROR_FETCHING_USERS);
    }
}


module.exports = 
{ 
    getUser
}