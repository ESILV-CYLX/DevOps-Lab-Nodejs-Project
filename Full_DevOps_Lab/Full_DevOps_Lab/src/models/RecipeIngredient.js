import mongoose from "mongoose";
import IngredientModel from "./Ingredient.js";

//Recipe Ingredient Schema for MongoDB
const recipeIngredientSchema = new mongoose.Schema({
    recipeIngredientId: { type: Number, required: true, unique: true},
    ingredient: { type: IngredientModel.schema, required: true},
    unit: { type: String, required: true},
    quantity: { type: Number, required: true},
    category: { type: String, required: true}
});

//ESM export
const RecipeIngredientModel = mongoose.model("RecipeIngredient", recipeIngredientSchema);
export default RecipeIngredientModel;