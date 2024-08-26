import express from "express";
import {  register } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", register);

export default router;
