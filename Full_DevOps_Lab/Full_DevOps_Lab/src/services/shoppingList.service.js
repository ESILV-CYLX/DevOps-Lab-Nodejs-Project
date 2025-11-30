const ShoppingList = require('../models/ShoppingList.model');
const MealPlan = require('../models/MealPlan.model');

// 1. Récupérer la liste (GET)
const getListByUserId = async (userId) => {
  // On cherche la liste de l'utilisateur
  const list = await ShoppingList.findOne({ userId: userId });
  return list;
};

// 2. Générer la liste depuis le planner (POST)
const generateListFromPlanner = async (userId, mealPlanId) => {
  
  // A. On récupère le planning avec les recettes peuplées
  const mealPlan = await MealPlan.findById(mealPlanId).populate('recipes');

  if (!mealPlan) {
    throw new Error("Meal Plan introuvable");
  }

  // B. L'Algo de fusion (Merge) des ingrédients
  const itemsMap = {}; // On map des "ShoppingItems"

  if (mealPlan.recipes && mealPlan.recipes.length > 0) {
    mealPlan.recipes.forEach(recipe => {
      if (recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          // Clé unique pour éviter les doublons (ex: "tomate")
          const key = ing.name.trim().toLowerCase();

          if (itemsMap[key]) {
            // Si l'item existe déjà, on cumule la quantité
            itemsMap[key].quantity += ing.quantity;
          } else {
            // Sinon on crée un nouvel objet ShoppingItem
            itemsMap[key] = {
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit,
              category: ing.category || "Divers",
              checked: false
            };
          }
        });
      }
    });
  }

  // C. Sauvegarde en Base de Données
  // On transforme la Map en tableau d'objets
  const newShoppingItems = Object.values(itemsMap);

  // On cherche si une liste existe déjà
  let shoppingList = await ShoppingList.findOne({ userId: userId });

  if (shoppingList) {
    // MISE À JOUR : On remplace les anciens items par les nouveaux
    shoppingList.items = newShoppingItems;
    shoppingList.updatedAt = new Date();
    await shoppingList.save();
  } else {
    // CRÉATION : On crée la liste avec les items
    shoppingList = await ShoppingList.create({
      userId: userId,
      items: newShoppingItems
    });
  }

  return shoppingList;
};

module.exports = {
  getListByUserId,
  generateListFromPlanner
};