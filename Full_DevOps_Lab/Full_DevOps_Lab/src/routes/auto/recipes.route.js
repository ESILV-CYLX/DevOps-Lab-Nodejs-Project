// /recipes (GET, POST, PUT, DELETE)
import express from 'express';
import { Recipe } from './Recipe.js';

const router = express.Router();
let recipes = [];

// GET /recipes
router.get('/', (req, res) => res.json(recipes));

// GET /recipes/:recipeId
router.get("/:recipeId", (req, res) => {
    const id = parseInt(req.params.recipeId);
    const recipe = recipe.find(r => r.recipeId === id);

    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    //TODO Favoriser les recettes publiques ou appartenant à l'utilisateur connecté
    res.json(recipe);
});


// POST /recipes
router.post('/', (req, res) => {
    const { recipeId, title, description, prepTime, cookTime, difficulty, cuisineType, servings, tags, instructions, privacy } = req.body;
    if (!recipeId || !title || !description || !cuisineType || !instructions) return res.status(400).json({ error: 'Missing title or description' });
    
    const newRecipe = new Recipe(recipeId, title, description, prepTime, cookTime, difficulty, cuisineType, servings, tags, instructions, privacy);
    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
});

// PUT /recipes/:id
router.put('/:id', (req, res) => {
    const id  = parseInt(req.params);
    const index = recipes.findIndex(r => r.recipeId === id);
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

export { recipes }; // for testing purposes
export default router;