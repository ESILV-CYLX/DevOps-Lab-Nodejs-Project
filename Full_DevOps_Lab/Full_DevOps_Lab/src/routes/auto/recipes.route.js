import express from "express";
import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe} from "../../controllers/recipes.controller.js";

import authenticateToken from "../../middleware/auth.middleware.js";

const router = express.Router();

// GET routes are public, others protected
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.use(authenticateToken);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;
