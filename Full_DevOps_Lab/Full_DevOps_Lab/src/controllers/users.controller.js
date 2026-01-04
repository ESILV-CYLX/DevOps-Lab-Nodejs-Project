import * as userService from "../services/users.service.js";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js"; // Needed to find the actual recipe details

export const getAllUsers = (req, res) => {
    const users = userService.getAllUsers();
    return res.json(users);
};

export const getUserById = (req, res) => {
    try {
        const user = userService.getUserById(req.params.id);
        return res.json(user);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
};

export const updateUser = (req, res) => {
    try {
        const updatedUser = userService.updateUser(req.params.id, req.userId, req.body);
        return res.json(updatedUser);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const result = await userService.updatePassword(req.params.id, req.userId, req.body);
        return res.json(result);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
};

// --- NEW: Favorites Logic (CORRECTED) ---

export const toggleFavorite = async (req, res) => {
  try {
    // FIX: Use req.userId (matches your other functions) instead of req.user.userId
    const userId = req.userId; 
    const recipeId = parseInt(req.body.recipeId);

    // console.log("Toggling favorite for User:", userId, "Recipe:", recipeId); // Uncomment to debug

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Initialize if missing
    if (!user.savedRecipes) user.savedRecipes = [];

    const index = user.savedRecipes.indexOf(recipeId);
    let isFavorite = false;

    if (index === -1) {
      user.savedRecipes.push(recipeId);
      isFavorite = true;
    } else {
      user.savedRecipes.splice(index, 1);
      isFavorite = false;
    }

    await user.save();
    res.json({ success: true, isFavorite, savedRecipes: user.savedRecipes });
  } catch (error) {
    console.error("Toggle Error:", error);
    res.status(500).json({ message: "Error updating favorites", error: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    // FIX: Use req.userId here too
    const userId = req.userId;
    
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedRecipes || user.savedRecipes.length === 0) {
        return res.json([]);
    }

    const favorites = await Recipe.find({ recipeId: { $in: user.savedRecipes } });
    res.json(favorites);
  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({ message: "Error fetching favorites", error: error.message });
  }
};