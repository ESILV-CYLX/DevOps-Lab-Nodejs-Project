import express from 'express';
import { getAllIngredients, getIngredientCategories, createIngredient } from '../../controllers/ingredients.controller.js';
import authenticateToken from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllIngredients);
router.get('/categories', getIngredientCategories);
router.post('/', authenticateToken, createIngredient);

export default router;