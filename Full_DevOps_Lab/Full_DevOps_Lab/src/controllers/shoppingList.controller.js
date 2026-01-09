import shoppingService from '../services/shoppingList.service.js';
import ShoppingList from '../models/ShoppingList.js';

// GET /shopping-list
const getShoppingList = async (req, res) => {
  try {
    const userId = req.userId;
    const list = await shoppingService.getListByUserId(userId);
    
    if (!list) {
      return res.status(200).json({ userId, items: [] });
    }
    
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /shopping-list/item (Add Ingredient)
const addItem = async (req, res) => {
  try {
    const userId = req.userId; // From Token
    const item = req.body; // { name, quantity, unit, category }
    
    const updatedList = await shoppingService.addItem(userId, item);
    res.status(201).json(updatedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /shopping-list/item/:itemId (Check/Uncheck)
const updateItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.params;
    const updateData = req.body; // { checked: true }

    const updatedList = await shoppingService.updateItem(userId, itemId, updateData);
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /shopping-list/item/:itemId
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const userId = req.userId;

    const updatedList = await ShoppingList.findOneAndUpdate(
      { userId: userId },
      { 
        $pull: { items: { _id: itemId } } 
      },
      { new: true } 
    );

    if (!updatedList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    res.status(200).json({ message: "Item deleted successfully", list: updatedList });
  } catch (error) {
    console.error("Delete Item Error:", error);
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
};

// DELETE /shopping-list/clear
const clearList = async (req, res) => {
    try {
        const userId = req.userId;
        const updatedList = await ShoppingList.findOneAndUpdate(
            { userId: userId },
            { $set: { items: [] } },
            { new: true }
        );
        res.json(updatedList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function syncIngredients(req, res) {
    try {
        const { ingredients } = req.body;
        const userId = req.userId;

        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: "Ingredients array is required" });
        }

        for (const ing of ingredients) {
            await shoppingService.addItem(userId, {
                name: ing.name,
                quantity: ing.quantity || 1,      
                unit: ing.unit || "g",     
                category: ing.category || "OTHER"
            });
        }

        res.status(200).json({ message: "Ingredients synced successfully" });
    } catch (err) {
        console.error("Sync Error:", err);
        res.status(500).json({ error: err.message });
    }
}

export default {
  getShoppingList,
  addItem,
  updateItem,
  deleteItem,
  clearList
};