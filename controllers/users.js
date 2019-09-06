const JWT = require('jsonwebtoken');
const Usermodel = require('../models/user');
const { JWT_SECRET } = require('../config/jwt');

signToken = user => {
  return JWT.sign({
    iss: 'tomo',
    sub: user.id,
    iat: new Date().getTime()   // current time
  }, JWT_SECRET);
}

module.exports = {
  signUp: async (req, res, next) => {
    const { name, email, password } = req.value.body;

    //check if email already exists
    const Emailisexist = await Usermodel.findOne({ "local.email": email });
    if (Emailisexist) {
      return res.status(403).json({ error: 'The email is already exists' });
    }

    //create a new user
    const newUser = new Usermodel({
      method: 'local',
      local: {
        name: name,
        email: email,
        password: password
      }
    });
    await newUser.save();

    //Generate the token
    const token = signToken(newUser);

    //Respond with token
    res.status(200).json({ token });
  },

  signIn: async (req, res, next) => {
    //token create
    const token = signToken(req.user);
    res.status(200).json({ token });

  },

  googleOAuth: async (req, res, next) => {
    //generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  facebookOAuth: async (req, res, next) => {

    const token = signToken(req.user);
    res.status(200).json({ token });
  }

};
