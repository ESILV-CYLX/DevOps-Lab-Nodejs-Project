import mongoose from 'mongoose';

// Définition de l'item
const ShoppingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'unit' },
  category: { type: String, default: 'Divers' },
  checked: { type: Boolean, default: false }
});

// Définition de la liste
const ShoppingListSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [ShoppingItemSchema], // Tableau d'items
  updatedAt: { type: Date, default: Date.now }
});

// EXPORT MODERNE (ESM)
// C'est ça qui corrige l'erreur 500 dans ton service
const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);
export default ShoppingList;