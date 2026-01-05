import IngredientModel from "../models/Ingredient.js";
import { IngredientCategory } from "../models/enums/IngredientCategory.js";

// GET all ingredients
export const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await IngredientModel.find().sort({ name: 1 });
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ingredient categories
export const getIngredientCategories = async (req, res) => {
  try {
    const categories = Object.values(IngredientCategory);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new ingredient
export const createIngredient = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    // Validation
    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, Category, and Price are required." });
    }

    // Auto-Generate Numeric ID (since schema requires Number)
    const ingredientId = Date.now(); 

    const newIngredient = await IngredientModel.create({
      ingredientId,
      name,
      category,
      price
    });

    res.status(201).json(newIngredient);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Ingredient ID or Name already exists." });
    }
    res.status(500).json({ message: error.message });
  }
};