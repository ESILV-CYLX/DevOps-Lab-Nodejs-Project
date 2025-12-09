import express from "express";
import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe} from "../../controllers/recipes.controller.js";

import authenticateToken from "../../middleware/auth.middleware.js";

const router = express.Router();

// Toutes les routes sont protégées par JWT
router.use(authenticateToken);

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;
