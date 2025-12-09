import IngredientModel from "./Ingredient.js";
import RecipeIngredient from "./RecipeIngredient.js";
import mongoose from "mongoose";


//Shopping Item Schema for MongoDB
const shoppingItemSchema = new mongoose.Schema({
    itemId: { type: Number, required: true, unique: true},
    ingredient: { type: IngredientModel.schema, required: true},
    recipeIngredients: { type: [RecipeIngredient.schema], default: []},
    quantity: { type: Number, required: true},
    unit: { type: String, required: true},
    category: { type: String, default: null},
    isChecked: { type: Boolean, required: true},
    shoppingListId: { type: Number, required: true}
});

//ESM export
const ShoppingItemModel = mongoose.model("ShoppingItem", shoppingItemSchema);
export default ShoppingItemModel;