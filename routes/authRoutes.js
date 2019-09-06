const express = require("express");
const router = require("express-promise-router")();
const passport = require('passport');
const passportservice = require('../services/passport')

const { validateBody, schemas } = require("../Validator/routeValidator");
const AccountController = require("../controllers/users");
const passportSignIn = passport.authenticate('local', { session: false });


router
  .route("/signup")
  .post(validateBody(schemas.authSchema), AccountController.signUp);

router.route("/signin")
  .post(validateBody(schemas.authSchema), passportSignIn, AccountController.signIn);

router.route('/oauth/google')
  .post(passport.authenticate('googleToken', { session: false }), AccountController.googleOAuth);

  
router.route('/oauth/facebook')
  .post(passport.authenticate('facebookToken', { session: false }), AccountController.facebookOAuth);


module.exports = router;
