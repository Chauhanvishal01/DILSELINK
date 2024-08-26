import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUserProfile } from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", authMiddleware, getUserProfile);

export default router;
