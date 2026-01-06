import shoppingService from '../services/shoppingList.service.js';

// GET /shopping-list
const getShoppingList = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from Token
    const list = await shoppingService.getListByUserId(userId);
    
    // Return empty structure if no list yet
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
    const userId = req.userId; // Récupéré via authenticateToken

    // On cherche la liste de l'utilisateur et on retire l'élément avec l'ID spécifié
    const updatedList = await ShoppingList.findOneAndUpdate(
      { userId: userId },
      { 
        $pull: { items: { _id: itemId } } 
      },
      { new: true } // Renvoie la liste mise à jour
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

export default {
  getShoppingList,
  addItem,
  updateItem,
  deleteItem
};