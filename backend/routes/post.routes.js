import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUsersPost,
  likeUnlikePost,
} from "../controller/post.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/getall", authMiddleware, getAllPosts);
router.get("/following", authMiddleware, getFollowingPosts);
router.get("/user/:username", authMiddleware, getUsersPost);
router.get("/getlikedpost/:id", authMiddleware, getLikedPosts);
router.delete("/delete/:id", authMiddleware, deletePost);
router.post("/comment/:id", authMiddleware, commentPost);
router.post("/like/:id", authMiddleware, likeUnlikePost);

export default router;
