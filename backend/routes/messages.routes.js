import express from "express";
import { getConversation, getMessages, sendMessage } from "../controller/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware,sendMessage);
router.get("/get/:otherUserId", authMiddleware,getMessages);
router.get("/conversation", authMiddleware,getConversation);

export default router;
