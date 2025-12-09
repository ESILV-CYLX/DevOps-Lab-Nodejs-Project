import RecipeModel from "../models/Recipe.js";

// Getting all recipes
export const getRecipes = async () => {
    return RecipeModel.find().exec();
};

// Getting a recipe by id
export const getRecipeById = async (id) => {
    const recipe = await RecipeModel.findOne({ recipeId: id });
    if (!recipe) throw new Error("Recipe not found");
    return recipe;
};

// Creating a new recipe
export const createRecipe = async (data) => {
    const lastRecipe = await RecipeModel.findOne().sort({ recipeId: -1 }).exec();
    const newRecipeId = lastRecipe ? lastRecipe.recipeId + 1 : 1;

    const newRecipe = new RecipeModel({
        recipeId: newRecipeId,
        ...data
    });

    return newRecipe.save();
};

// Updating a recipe
export const updateRecipe = async (id, data) => {
    const recipe = await RecipeModel.findOne({ recipeId: id });
    if (!recipe) throw new Error("Recipe not found");

    Object.assign(recipe, data);
    return recipe.save();
};

// Deleting a recipe
export const deleteRecipe = async (id) => {
    const recipe = await RecipeModel.findOneAndDelete({ recipeId: id });
    if (!recipe) throw new Error("Recipe not found");
    return recipe;
};