import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  deleteNotifications,
  getNotifications,
} from "../controller/notifications.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.delete("/delete", authMiddleware, deleteNotifications);
export default router;
