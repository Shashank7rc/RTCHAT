import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";

export const protectRoute = async (req,res,next)=>{
    try {
        const token =req.cookies.jwt
        if(!token) return res(401).json({message:"Unauthorized - No token provided"})

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded) return res(401).json({message:"Unauthorized - Invalid provided"})

        const user =await User.findById(decoded.userId).select("-password")//send everything except pass
        if(!user) return res(404).json({message:"User not found"});

        req.user=user; // send for next method :update
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:",error);
        res.status(500).json({message:"Internal Server error"});
    }
};