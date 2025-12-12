import * as recipeService from "../services/recipes.service.js";

// GET /recipes
export const getRecipes = async (req, res) => {
    try {
        const recipes = await recipeService.getRecipes();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /recipes/:id
export const getRecipeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const recipe = await recipeService.getRecipeById(id);
        res.json(recipe);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

// POST /recipes
export const createRecipe = async (req, res) => {
    try {
        // On fusionne les données du formulaire (req.body) avec l'ID du user connecté (req.user.userId)
        // req.user vient du middleware authenticateToken
        const recipeData = { ...req.body, userId: req.userId };
        
        const newRecipe = await recipeService.createRecipe(recipeData);
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT /recipes/:id
export const updateRecipe = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedRecipe = await recipeService.updateRecipe(id, req.body);
        res.json(updatedRecipe);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

// DELETE /recipes/:id
export const deleteRecipe = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await recipeService.deleteRecipe(id);
        res.status(204).send();
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
