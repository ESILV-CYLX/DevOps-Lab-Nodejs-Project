import shoppingService from '../services/shoppingList.service.js';

// GET /shopping-list?userId=...
const getShoppingList = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "UserId manquant" });
    }

    const list = await shoppingService.getListByUserId(userId);
    
    // Si la liste est vide ou n'existe pas encore, on renvoie un tableau vide
    if (!list) {
      return res.status(200).json({ userId: userId, items: [] });
    }
    
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /shopping-list/generate
const generateList = async (req, res) => {
  try {
    const { userId, mealPlanId } = req.body;

    if (!userId || !mealPlanId) {
      return res.status(400).json({ message: "userId et mealPlanId requis" });
    }

    const list = await shoppingService.generateListFromPlanner(userId, mealPlanId);
    
    res.status(201).json({ 
      message: "Liste générée avec succès", 
      list: list 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /shopping-list/item (Ajout manuel)
const addItem = async (req, res) => {
  try {
    const { userId, item } = req.body; // item = { name: "Lait", quantity: 1, ... }
    const updatedList = await shoppingService.addItem(userId, item);
    res.status(201).json(updatedList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /shopping-list/:itemId (Mise à jour)
const updateItem = async (req, res) => {
  try {
    const { userId } = req.body; // On a besoin de l'user ID pour trouver la bonne liste
    const { itemId } = req.params;
    const updateData = req.body; // ex: { checked: true }

    const updatedList = await shoppingService.updateItem(userId, itemId, updateData);
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /shopping-list/:itemId
const deleteItem = async (req, res) => {
  try {
    const { userId } = req.body; // Idéalement viendrait du Token d'auth plus tard
    const { itemId } = req.params;

    await shoppingService.deleteItem(userId, itemId);
    res.status(204).end(); // 204 = No Content (succès mais rien à renvoyer)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getShoppingList,
  generateList,
  addItem,
  updateItem,
  deleteItem
};