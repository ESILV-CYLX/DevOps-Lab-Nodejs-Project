import IngredientModel from "./Ingredient.js";
import RecipeIngredientModel from "./RecipeIngredient.js";
import mongoose from "mongoose";
import { IngredientCategory } from "./enums/IngredientCategory.js";

//Shopping Item Schema for MongoDB
const shoppingItemSchema = new mongoose.Schema({
    itemId: { type: Number, required: true, unique: true},
    ingredient: { type: IngredientModel.schema, required: true},
    recipeIngredients: { type: [RecipeIngredientModel.schema], default: []},
    quantity: { type: Number, required: true},
    unit: { type: String, required: true},
    category:  { 
        type: String, 
        enum: Object.values(IngredientCategory), 
        required: true 
    },
    isChecked: { type: Boolean, required: true},
    shoppingListId: { type: Number, required: true}
});

//ESM export
const ShoppingItemModel = mongoose.model("ShoppingItem", shoppingItemSchema);
export default ShoppingItemModel;