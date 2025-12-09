import mongoose from "mongoose";
import { IngredientCategory } from "./enums/IngredientCategory.js";

//Ingredient Schema for embedding
const ingredientSchema = new mongoose.Schema({
    ingredientId: { type: Number, required: true, unique: true},
    name: { type: String, required: true},
    category: { 
        type: String, 
        enum: Object.values(IngredientCategory), 
        required: true 
    },
    price: { type: Number, required: true}
});

//ESM export
const IngredientModel = mongoose.model("Ingredient", ingredientSchema);
export default IngredientModel;