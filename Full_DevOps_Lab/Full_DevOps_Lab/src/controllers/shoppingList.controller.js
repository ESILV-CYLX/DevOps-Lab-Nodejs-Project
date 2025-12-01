const shoppingService = require('../services/shoppingList.service');

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

module.exports = {
  getShoppingList,
  generateList
};