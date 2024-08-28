import express from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getme", authMiddleware, getMe);

export default router;
