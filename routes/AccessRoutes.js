const express = require("express");
const router = require("express-promise-router")();
const passport = require('passport');
const passportservice = require('../services/passport')

const passportJWT = passport.authenticate('jwt', { session: false });
const AccountController = require("../controllers/AccessRoutes");

//access this route only when the user is login or signup successfully, its just for testing before the react part is done 
router.route("/").get(passportJWT, AccountController.dashbord);

//i will control it later, on next feature
router.route("/profile/edit").get(passportJWT, AccountController.dashbord);





module.exports = router;