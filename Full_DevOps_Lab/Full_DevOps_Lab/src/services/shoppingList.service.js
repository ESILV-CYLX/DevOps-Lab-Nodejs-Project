import ShoppingList from '../models/ShoppingList.js';

export const getListByUserId = async (userId) => {
  return await ShoppingList.findOne({ userId: userId });
};

export const addItem = async (userId, newItem) => {
  // Mise à jour item déjà existant (même nom & unité)
  const result = await ShoppingList.findOneAndUpdate(
    { 
      userId, 
      "items.name": { $regex: new RegExp(`^${newItem.name}$`, 'i') }, // Case insensitive
      "items.unit": newItem.unit 
    },
    { 
      $inc: { "items.$.quantity": parseFloat(newItem.quantity) } //Incrémentation atomique
    },
    { new: true }
  );

  // Si result est null, l'item n'existait pas, on l'ajoute au tableau
  if (!result) {
    return await ShoppingList.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          items: {
            name: newItem.name,
            quantity: parseFloat(newItem.quantity),
            unit: newItem.unit,
            category: newItem.category || "OTHER",
            checked: false
          } 
        } 
      },
      { upsert: true, new: true } // upsert: true crée la liste si elle n'existe pas
    );
  }

  return result;
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