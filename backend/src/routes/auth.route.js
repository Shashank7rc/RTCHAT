import express from "express"; //1
import { signup , login , logout, updateProfile} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router=express.Router();//2

router.post("/signup",signup);//3

router.post("/login",login); //3.1
router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,(req,res)=> res.status(200).json(req.user));
export default router; //4
