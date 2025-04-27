import jwt from 'jsonwebtoken'
import User from "../Models/userModel.js"

const verifyJWT = async(req,res,next)=>{
    try{
      
        const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

        if(!token)
        {
            return res.status(401).json({success:false,message:"Unauthorized access"});
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user)
        {
            return res.status(401).json({success:false,
           message:"Session expired,Please login again"})
        }

        req.user = user;
        next();
    }
    catch(error)
    {
        console.error("Error in verifying token",error);
        return res.status(500).json({success:false,
        message:"Cannot process your request right now,Please try again later"
        })
    }
}

export default verifyJWT;