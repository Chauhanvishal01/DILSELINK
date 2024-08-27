import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  followUnfollowUser,
  getUserProfile,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", authMiddleware, getUserProfile);
router.post("/follow/:id", authMiddleware, followUnfollowUser);

export default router;
