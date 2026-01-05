import express from "express";
// Import the new functions here
import { 
    getUserById, 
    getAllUsers, 
    updateUser, 
    updatePassword,
    toggleFavorite, // <--- NEW
    getFavorites    // <--- NEW
} from "../../controllers/users.controller.js";

import authenticateToken from "../../middleware/auth.middleware.js";

const router = express.Router();

// 1. Static/Specific Routes MUST come first
router.get("/", getAllUsers);
router.get("/me/favorites", authenticateToken, getFavorites);
router.post("/me/favorites", authenticateToken, toggleFavorite);
router.delete("/me/favorites/:recipeId", authenticateToken, toggleFavorite);

// 2. Dynamic Routes (/:id) catch everything else, so they go LAST
router.get("/:id", getUserById);
router.put("/:id", authenticateToken, updateUser);
router.put("/:id/password", authenticateToken, updatePassword);

export default router;