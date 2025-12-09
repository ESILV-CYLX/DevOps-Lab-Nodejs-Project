import ShoppingList from '../models/ShoppingList.js';
import MealPlan from '../models/MealPlan.js';

export const getListByUserId = async (userId) => {
  return await ShoppingList.findOne({ userId: userId });
};

export const generateListFromPlanner = async (userId, mealPlanId) => {
  
  const mealPlan = await MealPlan.findById(mealPlanId).populate('recipes');

  if (!mealPlan) {
    throw new Error("Meal Plan introuvable");
  }

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

export const addItem = async (userId, itemData) => {
  let list = await ShoppingList.findOne({ userId });
  
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

export const deleteItem = async (userId, itemId) => {
  const list = await ShoppingList.findOne({ userId });
  if (!list) throw new Error("Liste introuvable");

  list.items.pull(itemId);
  return await list.save();
};

export default {
  getListByUserId,
  generateListFromPlanner,
  addItem,
  updateItem,
  deleteItem
};