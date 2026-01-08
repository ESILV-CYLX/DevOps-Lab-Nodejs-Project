import Recipe from "../models/Recipe.js";
import User from "../models/User.js"; 
import { CuisineType } from "../models/enums/CuisineType.js";
import { Flavors } from "../models/enums/Flavors.js";
import { Units } from "../models/enums/Units.js";

// GET RECIPE METADATA
export const getRecipeMetadata = async (req, res) => {
  try {
    res.json({
      cuisineTypes: Object.values(CuisineType),
      flavors: Object.values(Flavors),
      units: Object.values(Units)
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching metadata", error: err.message });
  }
};

// GET ALL RECIPES
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes", error: err.message });
  }
};

// GET RECIPE BY ID
export const getRecipeById = async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const recipe = await Recipe.findOne({ recipeId });
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipe", error: err.message });
  }
};

// CREATE RECIPE
export const createRecipe = async (req, res) => {
  try {
    const recipeId = Math.floor(100000 + Math.random() * 900000);
    
    // Generate IDs for ingredients before creating the object
    const ingredientsWithIds = (req.body.ingredients || []).map(ing => ({
        ...ing,
        ingredientId: Math.floor(Math.random() * 100000)
    }));

    const newRecipe = new Recipe({
      ...req.body,
      recipeId: recipeId,
      userId: req.userId,
      ingredients: ingredientsWithIds,
      privacy: req.body.privacy || false,
      prepTime: parseInt(req.body.prepTime) || 0,
      cookTime: parseInt(req.body.cookTime) || 0,
      servings: parseInt(req.body.servings) || 1,
      difficulty: parseInt(req.body.difficulty) || 1,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Error creating recipe", error: err.message });
  }
};

// UPDATE RECIPE
export const updateRecipe = async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.userId;

    console.log(`[UPDATE] Recipe: ${recipeId}, User: ${userId}`);

    const recipe = await Recipe.findOne({ recipeId });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (String(recipe.userId) !== String(userId)) {
      return res.status(403).json({ message: "You can only modify your own recipes" });
    }

    const { title, prepTime, cookTime, difficulty, flavor, servings, cuisineType, ingredients, instructions, description, image, privacy } = req.body;

    if (title) recipe.title = title;
    if (prepTime) recipe.prepTime = prepTime;
    if (cookTime) recipe.cookTime = cookTime;
    if (difficulty) recipe.difficulty = difficulty;
    if (flavor) recipe.flavor = flavor;
    if (servings) recipe.servings = servings;
    if (cuisineType) recipe.cuisineType = cuisineType;
    if (description) recipe.description = description;
    if (image) recipe.image = image;
    if (instructions) recipe.instructions = instructions;
    if (privacy) recipe.privacy = privacy;

    if (ingredients && Array.isArray(ingredients)) {
        recipe.ingredients = ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            ingredientId: ing.ingredientId || Math.floor(Math.random() * 100000) // Generate ID if missing
        }));
    }

    const updatedRecipe = await recipe.save();
    
    console.log("[UPDATE] Success!");
    res.json(updatedRecipe);

  } catch (err) {
    console.error("Update Error:", err);
    // Print Validation Errors if they exist
    if (err.errors) {
        Object.keys(err.errors).forEach(key => {
            console.error(`Validation Error on ${key}: ${err.errors[key].message}`);
        });
    }
    res.status(500).json({ message: "Error updating recipe", error: err.message });
  }
};

// DELETE RECIPE
export const deleteRecipe = async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.userId;

    const recipe = await Recipe.findOne({ recipeId });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (String(recipe.userId) !== String(userId)) {
      return res.status(403).json({ message: "You can only delete your own recipes" });
    }

    await Recipe.deleteOne({ recipeId });
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting recipe", error: err.message });
  }
};