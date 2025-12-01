// On passe en syntaxe "import" pour être compatible avec ton app.js
import ShoppingList from '../models/ShoppingList.js';
import MealPlan from '../models/MealPlan.js';

// 1. Récupérer la liste (GET)
export const getListByUserId = async (userId) => {
  return await ShoppingList.findOne({ userId: userId });
};

// 2. Générer la liste depuis le planner (POST)
export const generateListFromPlanner = async (userId, mealPlanId) => {
  
  // A. On récupère le planning avec les recettes peuplées
  const mealPlan = await MealPlan.findById(mealPlanId).populate('recipes');

  if (!mealPlan) {
    throw new Error("Meal Plan introuvable");
  }

  // B. L'Algo de fusion
  const itemsMap = {}; 

  if (mealPlan.recipes && mealPlan.recipes.length > 0) {
    mealPlan.recipes.forEach(recipe => {
      if (recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          const key = ing.name.trim().toLowerCase();

          if (itemsMap[key]) {
            itemsMap[key].quantity += ing.quantity;
          } else {
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

  // C. Sauvegarde
  const newShoppingItems = Object.values(itemsMap);
  let shoppingList = await ShoppingList.findOne({ userId: userId });

  if (shoppingList) {
    shoppingList.items = newShoppingItems;
    shoppingList.updatedAt = new Date();
    await shoppingList.save();
  } else {
    shoppingList = await ShoppingList.create({
      userId: userId,
      items: newShoppingItems
    });
  }

  return shoppingList;
};

// 3. AJOUTER un item manuellement (POST)
export const addItem = async (userId, itemData) => {
  let list = await ShoppingList.findOne({ userId });
  
  // CORRECTION CRITIQUE POUR LE TEST :
  // Si la liste n'existe pas (DB vide au début du test), on la crée !
  if (!list) {
    list = await ShoppingList.create({ 
      userId, 
      items: [], 
      updatedAt: new Date() 
    });
  }

  list.items.push(itemData);
  return await list.save();
};

// 4. MODIFIER un item (PUT)
export const updateItem = async (userId, itemId, updateData) => {
  const list = await ShoppingList.findOne({ userId });
  if (!list) throw new Error("Liste introuvable");

  const item = list.items.id(itemId);
  if (!item) throw new Error("Item introuvable");

  if (updateData.checked !== undefined) item.checked = updateData.checked;
  if (updateData.quantity) item.quantity = updateData.quantity;
  if (updateData.name) item.name = updateData.name;

  return await list.save();
};

// 5. SUPPRIMER un item (DELETE)
export const deleteItem = async (userId, itemId) => {
  const list = await ShoppingList.findOne({ userId });
  if (!list) throw new Error("Liste introuvable");

  list.items.pull(itemId);
  return await list.save();
};

// Export par défaut pour simplifier l'import dans le controller
export default {
  getListByUserId,
  generateListFromPlanner,
  addItem,
  updateItem,
  deleteItem
};