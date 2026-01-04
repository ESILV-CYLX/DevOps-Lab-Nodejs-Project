import mongoose from "mongoose";

// Simple Schema for Option 2 (No strict relation to Ingredient collection)
const shoppingItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: '' },
    category: { type: String, default: 'Divers' },
    checked: { type: Boolean, default: false } // The "Box" to check as bought
});

// We don't export a model, just the schema, because it will be embedded in ShoppingList
export default shoppingItemSchema;