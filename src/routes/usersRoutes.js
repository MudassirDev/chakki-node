import express from "express";
import { handleRegistration } from "../controller/usersController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, handleRegistration)

export default router;