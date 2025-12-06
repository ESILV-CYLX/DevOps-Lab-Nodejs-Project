import express from "express";
import {getUserById, getAllUsers, updateUser, updatePassword} from "../../controllers/users.controller.js";

import authenticateToken from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * /users           → GET    (public list)
 * /users/:id       → GET    (public profile)
 * /users/:id       → PUT    (only own account)
 * /users/:id/pass  → PUT    (change password - own account)
 */

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", authenticateToken, updateUser);
router.put("/:id/password", authenticateToken, updatePassword);

export default router;