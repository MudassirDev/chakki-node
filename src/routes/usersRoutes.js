import express from "express";
import { handleRegistration, handleLogin } from "../controller/usersController.js";

const router = express.Router();

router.post("/add", handleRegistration)
router.post("/login", handleLogin)

export default router;