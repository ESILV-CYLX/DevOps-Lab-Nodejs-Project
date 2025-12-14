import mongoose from 'mongoose';
import shoppingItemSchema from './ShoppingItem.js';

const ShoppingListSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [shoppingItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);

// --- DATABASE REPAIR SCRIPT ---
// This runs on server start to clean up ALL old, conflicting indexes found so far.

const cleanIndexes = async () => {
  const indexesToDrop = [
    'items.itemId_1',                                     // Layer 1
    'items.ingredient.ingredientId_1',                    // Layer 2
    'items.recipeIngredients.recipeIngredientId_1',       // Layer 2 (Branch B)
    'items.recipeIngredients.ingredient.ingredientId_1'   // Layer 3 (The current error)
  ];

  for (const indexName of indexesToDrop) {
    try {
      await ShoppingList.collection.dropIndex(indexName);
      console.log(`✅ SUCCESS: Dropped old index: ${indexName}`);
    } catch (e) {
      // If the index is already gone, we just ignore the error silently
    }
  }
};

// Run the cleaner immediately
cleanIndexes();
// ------------------------------

export default ShoppingList;