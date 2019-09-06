const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const Localstrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const { JWT_SECRET } = require('../config/jwt');
const Usermodel = require('../models/user');

const config = require('config');
// const clientID = config.get('clientID');
// const clientSecret = config.get('clientSecret');

//JWT Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        //get the user token
        const user = await Usermodel.findById(payload.sub);

        //handle if the user not exists.
        if (!user) {
            return done(null, false);
        }

        //return user
        done(null, user);

    } catch (error) {
        done(error, false);
    }
}));

// google Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    passReqToCallback: true
}, async (accessToken, refreshToken, profile, done) => {
    try {


        //check if user is already exists
        const checkUserexist = await Usermodel.findOne({ "google.id": profile.id });
        if (checkUserexist) {
            return done(null, checkUserexist);
        }

        //create new account
        const newUser = new Usermodel({
            method: 'google',
            google: {
                name: profile.displayName,
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false, error.message);

    }
}));

// facebook strategy:

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.FbClientID,
    clientSecret: config.FbClientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {


        const checkUserexist = await Usermodel.findOne({ "facebook.id": profile.id });
        if (checkUserexist) {
            return done(null, checkUserexist);
        }
        const newUser = new Usermodel({
            method: 'facebook',
            facebook: {
                name: profile.displayName,
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }
}));




//Local Strategy
passport.use(new Localstrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        //find the user with this eamil
        const user = await Usermodel.findOne({ "local.email": email });

        //did't get? handle it
        if (!user) {
            return done(null, false);
        }

        //check the password is correct
        const isMatch = await user.isValidPassword(password);

        //is not match, handle it
        if (!isMatch) {
            return done(null, false);
        }

        //is match, return user.
        done(null, user);

    } catch (error) {
        done(error, false);
    }

}));