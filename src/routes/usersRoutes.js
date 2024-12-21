import express from "express";
import { handleRegistration, handleLogin, handleUsers } from "../controller/usersController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", handleRegistration)
router.post("/login", handleLogin)
router.get("/", authMiddleware, handleUsers)

export default router;