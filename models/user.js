const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//create schema
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true

    },
    local: {
        name: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,

        }

    },
    google: {
        name: {
            type: String
        },
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }

    },
    facebook: {
        name: {
            type: String
        },
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }

    },
    follower: [
        {
            user: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'user'
            }
        }
    ],
    following: [
        {
            user: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'user'
            }
        }
    ]

});

// encrypt before save the password
userSchema.pre('save', async function (next) {

    try {
        if (this.method !== 'local') {
            next();
        }
        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(this.local.password, salt);

        this.local.password = passwordHash;
        next();

    } catch (error) {
        next(error);
    }

});

userSchema.methods.isValidPassword = async function (newPassword) {
    try {

        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
}

//model create
const Usermodel = mongoose.model('user', userSchema)

//export model
module.exports = Usermodel;
