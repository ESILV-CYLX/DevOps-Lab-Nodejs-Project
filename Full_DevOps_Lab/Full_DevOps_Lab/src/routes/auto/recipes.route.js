// /recipes (GET, POST, PUT, DELETE)
import express from 'express';
import { Recipe } from './Recipe.js';

const router = express.Router();
let recipes = [];

// GET /recipes
router.get('/', (req, res) => res.json(recipes));

// POST /recipes
router.post('/', (req, res) => {
    if (!req.body.title || !req.body.description) {
        return res.status(400).json({ error: 'Missing title or description' });
    }

    const { recipeId, title, description, prepTime, cookTime, difficulty, cuisineType, servings, tags, instructions, privacy } = req.body;
    const newRecipe = new Recipe(recipeId, title, description, prepTime, cookTime, difficulty, cuisineType, servings, tags, instructions, privacy);
    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
});

// PUT /recipes/:id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const index = recipes.findIndex(r => r.recipeId.toString() === id);
    if (index === -1) return res.status(404).json({ error: 'Recipe not found' });

    const updatedRecipeData = req.body;
    const updatedRecipe = new Recipe(
        parseInt(id),
        updatedRecipeData.title,
        updatedRecipeData.description,
        updatedRecipeData.prepTime,
        updatedRecipeData.cookTime,
        updatedRecipeData.difficulty,
        updatedRecipeData.cuisineType,
        updatedRecipeData.servings,
        updatedRecipeData.tags,
        updatedRecipeData.instructions,
        updatedRecipeData.privacy
    );
    recipes[index] = updatedRecipe;
    res.json(updatedRecipe);
});

// DELETE /recipes/:id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = recipes.findIndex(r => r.recipeId.toString() === id);
    if (index === -1) return res.status(404).json({ error: 'Recipe not found' });
    recipes.splice(index, 1);
    res.status(204).send();
});

export default router;