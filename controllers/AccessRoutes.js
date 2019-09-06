const JWT = require('jsonwebtoken');
//const Usermodel = require('../models/user');
const { JWT_SECRET } = require('../config/jwt');


signToken = user => {
    return JWT.sign({
        iss: 'tomo',
        sub: user.id,
        iat: new Date().getTime()   // current time
    }, JWT_SECRET);
}

module.exports = {
    dashbord: async (req, res, next) => {

        res.json({ dashbord: "secret resource access" });
    }

}

