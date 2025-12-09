import mongoose from 'mongoose';
import ShoppingItemModel from './ShoppingItem.js';

// Shopping List Schema for MongoDB
const ShoppingListSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: { type: [ShoppingItemModel.schema], default: []},
  updatedAt: { type: Date, default: Date.now }
});

// EXPORT MODERNE (ESM)
// C'est ça qui corrige l'erreur 500 dans ton service
const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);
export default ShoppingList;