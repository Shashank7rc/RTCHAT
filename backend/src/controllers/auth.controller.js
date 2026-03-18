import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import dotenv from "dotenv/config";
import { sendWelcomeEmail } from "../emails/emailHandler.js";

export const signup = async (req,res)=>{
    const {fullName,email,password}=req.body

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password too short"});
        }
        //check if email is valid

        const emailreg=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailreg.test(email)){
            return res.status(400).json({message:"Email invalid"});
        }

        const user=await User.findOne({email});
        if(user) return res.status(400).json({message:"Email already exists"})

        const salt=await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User ({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
          //  generateToken(newUser._id,res);
            // await newUser.save();
            //first save user then gen token
            const savedUser= await newUser.save();
            generateToken(savedUser._id,res);

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });

        try {
            await sendWelcomeEmail(savedUser.email,savedUser.fullName,process.env.CLIENT_URL);
        } catch (error) {
            console.log("failed to send welcome email",error);
        }
        }
        else{
            res.status(400).json({message:"User data invalid"});
        }

    } catch (error) {
        console.log("Error in signup controller:",error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const login =async (req,res)=>{
    const {email,password}=req.body;
    if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
}
    try {
        const user= await User.findOne({email});
        if(!email) return res.status(400).json({message:"Invalid Credentials"});
        
        const ispasscorrect= await bcrypt.compare(password,user.password)
        if(!ispasscorrect) return res.status(400).json({message:"Invalid Credentials"});

        generateToken(user._id,res)

         res.status(200).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
            });

    } catch (error) {
        console.error("Error in login controller",error)
        res.status(500).json({message:"Internal server error"})
    }
};

export const logout =(_,res)=>{
    res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out Successfully"});
};