import { postSchema, replySchema } from "../zod/postschema.js";
import Post from '../Models/postModel.js'
import User from '../Models/userModel.js'
import {v2 as cloudinary}  from 'cloudinary'

//create Post
const createPost = async (req, res) => {
    try {

        const result = postSchema.safeParse(req.body);

        if (!result.success) {
            const errorMessages = result.error.errors.map((error) => error.message);
            return res.status(400).json({ success: result.success, message: errorMessages });
        }

        const { postTitle } = result.data;
        let {postImg} = result.data;

        const postedBy = req.user._id;

        if(postImg)
        {
            const uploadedresponse = await cloudinary.uploader.upload(postImg);
            postImg = uploadedresponse.secure_url;
        }

        const newPost = await Post.create({
            postedBy,
            postTitle,
            postImg
        })

        return res.status(201).json({ success: true,data:newPost, message: "Post created successfully" });
    }
    catch (error) {
        console.error("Error in creating post", error);
        return res.status(500).json({
            success: false,
            message: "Error occured in creating post,Try again later"
        })
    }
}


//get Post

const getPost = async (req, res) => {
    try {

        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post does not exist"
            })
        }

        return res.status(200).json({
            success: true, data: post,
            message: "Post fetched successfully"
        })
    }
    catch (error) {
        console.error("Error in getting post", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching post"
        })
    }
}

//delete Post

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const userId = req.user._id;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post does not exist"
            })
        }

        if (post.postedBy.toString() !== userId.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorised to delete Post"
            })
        }

        if(post.postImg)
        {
            const imgId = post.postImg.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleting Post", error);
        return res.status(500).json({
            success: false,
            message: "Error occured in deleting Post,Try again later"
        })
    }
}


//like post

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;

        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post does not exist"
            })
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
            return res.status(200).json({
                success: true,
                message: "Post unliked successfully"
            })
        }
        else {
            await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
            return res.status(200).json({
                success: true,
                message: "Post liked successfully"
            })
        }
    }
    catch (error) {
        console.error("Error in liking Post", error);
        return res.status(500).json({
            success: false,
            message: "Cannot process your request,right now,Try again later"
        })
    }
}

//reply controller
const replyPost = async (req, res) => {
    try {
        const result = replySchema.safeParse(req.body);

        if (!result.success) {
            const errorMessages = result.error.errors.map((error) => error.message);
            return res.status(400).json({ success: result.success, message: errorMessages });
        }

        const { id: postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post does not exist" });
        }

        const userId = req.user._id;
        const username = req.user.username;
        const profilePic = req.user.profilePic;

        const {text} = result.data;

        const reply = { userId, profilePic, text, username };

        post.replies.push(reply);
        await post.save();

        return res.status(200).json({
            success: true, data: reply,
            message: "Replied successfully"
        })
    }
    catch (error) {
        console.error("Error in replying", error);
        return res.status(500).json({
            success: false,
            message: "Error occured in replying,try again later"
        })
    }
}

//get feed post

const getFeedPost = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            })
        }

        const following = user.following;

        const feedPosts = await Post.find({postedBy:{$in:following}}).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true, data: feedPosts,
            message: "Feed Posts fetched successfully"
        })
    }
    catch (error) {
        console.error("Error in get feed post", error);
        return res.status(500).json({
            success: false,
            message: "Cannot fetch posts,try again later"
        })
    }
}

const getUserPost = async(req,res)=>{

    try{
        const {username} = req.params;

        const user = await User.findOne({username});

        if(!user)
        {
           return res.status(404).json({success:false,message:"User does not exist"})
        }

        const post = await Post.find({postedBy:user._id}).sort({createdAt:-1});
        
        if(!post)
        {
            return res.status(404).json({success:false,message:"Post does not exist"});
        }

        return res.status(200).json({success:true,data:post,message:"Post fetched successfully"})
    }
    catch(error)
    {
        console.log("Error occured",error.message);
        return res.status(500).json({success:false,message:"Cannot process your request right now,try again later"});
    }
}

export {
    createPost,
    getPost,
    deletePost,
    likeUnlikePost,
    replyPost,
    getFeedPost,
    getUserPost
}