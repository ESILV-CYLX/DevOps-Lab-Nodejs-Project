const express = require('express');
const router = express.Router();
// On importe ton contrôleur
const shoppingController = require('../controllers/shoppingList.controller');

// 1. Route pour récupérer la liste (GET)
// URL : http://localhost:3000/shopping-list?userId=123
router.get('/', shoppingController.getShoppingList);

// 2. Route pour générer la liste (POST)
// URL : http://localhost:3000/shopping-list/generate
// Body : { "userId": "...", "mealPlanId": "..." }
router.post('/generate', shoppingController.generateList);

module.exports = router;