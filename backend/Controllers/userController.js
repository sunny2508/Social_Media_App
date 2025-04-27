import mongoose from "mongoose";
import User from "../Models/userModel.js"
import { signUpSchema, updateProfileSchema } from "../zod/userschema.js";
import {v2 as cloudinary} from 'cloudinary';
import Post from "../Models/postModel.js";

const generateAccessAndRefreshToken = async (id) => {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
}

//signup controller

const signup = async (req, res) => {

    try {
        const result = signUpSchema.safeParse(req.body);

        if (!result.success) {

            const errorMessages = result.error.errors.map((error) => error.message);
            return res.status(400).json({ success: result.success, message: errorMessages });
        }

        const { name, email, username, password } = result.data;

        if ([name, email, username, password].some((field) => field?.trim() === '')) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingEmail = await User.findOne({email});

        if(existingEmail)
        {
            return res.status(409).json({success:false,
                message:"Email is already registered"
            })
        }

        const existingUsername = await User.findOne({username});

        if(existingUsername)
        {
            return res.status(409).json({success:false,
                message:"Username is already taken"
            })
        }

        const newUser = await User.create({
            name,
            email,
            username,
            password
        });

        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

        return res.status(201).json({
            success: true, data: createdUser,
            message: "User registered successfully"
        });
    }
    catch (error) {
        console.error("Error occured during signup", error);

        return res.status(500).json({
            success: false,
            message: "An unexpected error occured,Please try again later"
        })
    }
}

//login controller

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if ([email, password].some((field) => field?.trim() === '')) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ success: true, data: loggedInUser, message: "User logged in successfully" });

    }
    catch (error) {
        console.error("Error occured in login", error);
        res.stat(500).json({
            success: false,
            message: "Unexpected error occured , please try again later"
        })
    }
}

//logout controller
const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: { refreshToken: "" }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true
        }

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ success: true, message: "User logged out successfully" });
    }
    catch (error) {
        console.error("Error occured in logout", error);
        return res.status(500).json({
            success: false,
            message: "Error occured , try again later"
        })
    }
}

// get profile controller

const getProfile = async (req, res) => {
    try {
        const { query } = req.params;

        let user;

        if(mongoose.Types.ObjectId.isValid(query))
        {
         user = await User.findOne({_id:query}).select("-password -refreshToken -updatedAt")
        }
        else{
          user = await User.findOne({username:query}).select("-password -refreshToken -updatedAt")
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            })
        }

        return res.status(200).json({
            success: true, data: user,
            message: "User fetched successfully"
        })
    }
    catch (error) {
        console.error("Error occured in fetching user", error);
        return res.status(500).json({
            success: false,
            message: "Cannot process your request right now,Please try later "
        })
    }
}

//update controller 

const updateProfile = async (req, res) => {
    try {
        const result = updateProfileSchema.safeParse(req.body);

        if (!result.success) {
            const errorMessages = result.error.errors.map((error) => error.message);
            return res.status(400).json({ success: result.success, message: errorMessages });
        }

        const { name, username, email, password, bio } = result.data;
        let {profilePic} = result.data;

        const userId = req.user._id;

        if (req.params.id !== userId.toString()) {
            return res.status(401).json({
                success: false,
                message: "You cannot update other's profile"
            })
        }

        const user = await User.findById(userId).
            select("-password -refreshToken");

            

        if(profilePic)
        {
            if(user.profilePic)
            {
                try{
                    await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
                }
                catch(error)
                {
                    console.log("Failed to delete previous profile picture",err);
                    res.status(500).json({success:false,message:"Failed to delete previous profile picture"})
                }   
            }
            const uploadedresponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedresponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        if (password) {
            user.password = password
        }

        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        await user.save({ validateBeforeSave: false });

        await Post.updateMany(
            {"replies.userId":userId},

            {
                $set:{
                    "replies.$[reply].username":user.username,
                    "replies.$[reply].profilePic":user.profilePic
                }
            },
           {arrayFilters:[{"reply.userId":userId}]}
        );

        return res.status(200).json({
            success: true, data: user,
            message: "Profile has been updated"
        })
    }
    catch (error) {
        console.error("Error in update Profile", error);
        return res.status(500).json({
            success: false,
            message: "Cannot update profile right now ,try again later"
        })
    }
}


//follow unfollow controller

const followUnfollowUser= async(req,res)=>{
    try{
        const {id} = req.params;

        const userId = req.user._id;

        if(id === userId.toString())
        {
            return res.status(400).json({success:false,
                message:"You cannot follow or unfollow yourself"
            })
        }

        const userToModify = await User.findById(id);
        const currentUser = await User.findById(userId);

        if(!userToModify || !currentUser)
        {
            return res.status(400).json({success:false,
                message:"User does not exist"
            })
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing)
        {
            await User.findByIdAndUpdate(userId,{$pull:{following:id}});
            await User.findByIdAndUpdate(id,{$pull:{followers:userId}});
            return res.status(200).json({success:true,message:"User unfollowed successfully"});
        }
        else{
            await User.findByIdAndUpdate(userId,{$push:{following:id}});
            await User.findByIdAndUpdate(id,{$push:{followers:userId}});
            return res.status(200).json({success:true,message:"User followed successfully"});
        }
    }
    catch(error)
    {
        console.log("Error occured in follow unfollow user",error);
        return res.status(500).json({success:false,
        message:"Unexpected error occured,try again later"
        })
    }
}

const checkAuth = async(req,res)=>{
    try{
      const user = await User.findById(req.user._id).select('-password -refreshToken')

      if(!user)
      {
        res.status(404).json({success:false,message:"User does not exist"});
      }
      res.status(200).json({success:true,data:user});
    }
    catch(error)
    {
        console.log("Error occured",error.message);
        res.status(500).json({success:false,message:"Unexpected error occured,Please try again later"})
    }
}
export {
    signup,
    login,
    logout,
    getProfile,
    updateProfile,
    followUnfollowUser,
    checkAuth
}