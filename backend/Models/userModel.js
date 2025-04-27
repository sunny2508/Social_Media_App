import mongoose, { Schema } from 'mongoose'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
        maxLength:500
    },
    followers: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: []
    },
    refreshToken:{
        type:String
    }
}, { timestamps: true });

//Hash the password before saving

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcryptjs.hash(this.password, 10);
    next();
})

//instance method to check password correct or not

userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcryptjs.compare(password, this.password);
}

//instance method to generate access and refresh token

userSchema.methods.generateAccessToken = function () {

    return jwt.sign({
        _id: this._id,
        name: this.name
    }, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
};

userSchema.methods.generateRefreshToken = function () {

    return jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

const User = mongoose.model("User",userSchema);

export default User;