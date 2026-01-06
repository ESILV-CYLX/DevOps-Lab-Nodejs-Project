import mongoose from "mongoose";
import { Units } from "./enums/Units.js";
import { IngredientCategory } from "./enums/IngredientCategory.js";

// Simple Schema for Option 2 (No strict relation to Ingredient collection)
const shoppingItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { 
        type: String, 
        enum: Object.values(Units),
        required: true 
    },
    category: { 
        type: String, 
        enum: Object.values(IngredientCategory),
        default: 'OTHER' 
    },
    checked: { type: Boolean, default: false } // The "Box" to check as bought
});

// We don't export a model, just the schema, because it will be embedded in ShoppingList
export default shoppingItemSchema;