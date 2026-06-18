import express from "express";
import { arcjetprtotection } from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllContacts,
        getChatPartners,
        sendMessage, 
        getMessagesByUserId} from "../controllers/message.controller.js";



const router = express.Router();

router.use(arcjetprtotection,protectRoute);

router.get("/contacts",getAllContacts); /*protectRoute adds user to req body then 
in getAllContacts we can access it   const loggedInUserId = req.user._id; so protectRoute middleware
is required*/

router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;