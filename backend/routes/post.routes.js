import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
} from "../controller/post.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/getall", authMiddleware, getAllPosts);
router.delete("/delete/:id", authMiddleware, deletePost);
router.post("/comment/:id", authMiddleware, commentPost);
router.post("/like/:id", authMiddleware, likeUnlikePost);

export default router;
