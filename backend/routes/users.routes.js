import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  followUnfollowUser,
  getSuggestion,
  getUserProfile,
  updateUserProfile,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", authMiddleware, getUserProfile);
router.get("/suggestedUsers", authMiddleware, getSuggestion);
router.post("/follow/:id", authMiddleware, followUnfollowUser);
router.post("/update", authMiddleware, updateUserProfile);
router.get("/followers", authMiddleware, getFollowers);
router.get("/following", authMiddleware, getFollowing);

export default router;
