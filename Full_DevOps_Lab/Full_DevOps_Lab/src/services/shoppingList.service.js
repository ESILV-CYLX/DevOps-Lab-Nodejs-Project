import ShoppingList from '../models/ShoppingList.js';

export const getListByUserId = async (userId) => {
  return await ShoppingList.findOne({ userId: userId });
};

// --- ROBUST ADD ITEM (With Auto-Cleaning) ---
export const addItem = async (userId, newItem) => {
  let list = await ShoppingList.findOne({ userId });
  
  if (!list) {
    list = await ShoppingList.create({ 
      userId, 
      items: [], 
      updatedAt: new Date() 
    });
  } else {
    // === SANITIZATION STEP ===
    // Filter out any item that is "corrupted" (missing a name) from old tests
    const originalLength = list.items.length;
    list.items = list.items.filter(item => item && item.name);
    
    if (list.items.length !== originalLength) {
        console.log(`[Auto-Clean] Removed ${originalLength - list.items.length} corrupted items for user ${userId}`);
    }
  }

  // Now it is safe to loop because we know all items have names
  const existingItemIndex = list.items.findIndex(item => 
    item.name.toLowerCase() === newItem.name.toLowerCase() && 
    item.unit === newItem.unit
  );

  if (existingItemIndex > -1) {
    // UPDATE: Sum the quantity
    list.items[existingItemIndex].quantity += parseFloat(newItem.quantity);
  } else {
    // INSERT: Push new item
    list.items.push({
        name: newItem.name,
        quantity: parseFloat(newItem.quantity),
        unit: newItem.unit,
        category: newItem.category || "Divers",
        checked: false
    });
  }

  return await list.save();
};

export const updateItem = async (userId, itemId, updateData) => {
  const list = await ShoppingList.findOne({ userId });
  if (!list) throw new Error("List not found");

  const item = list.items.id(itemId);
  if (!item) throw new Error("Item not found");

  if (updateData.checked !== undefined) item.checked = updateData.checked;
  if (updateData.quantity) item.quantity = updateData.quantity;
  if (updateData.name) item.name = updateData.name;

  return await list.save();
};

export const deleteItem = async (userId, itemId) => {
  const list = await ShoppingList.findOne({ userId });
  if (!list) throw new Error("List not found");

  list.items.pull(itemId);
  return await list.save();
};

export default {
  getListByUserId,
  addItem,
  updateItem,
  deleteItem
};