import express from "express";
import { signup, login, logout } from "../../controllers/auth.controller.js";

const router = express.Router();

/**
 * /auth/signup   → POST    (creates a new user)
 * /auth/login    → POST    (authenticates a user)
 * /auth/logout   → GET     (logs out a user)
 */

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;