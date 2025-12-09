import mongoose from "mongoose";
import IngredientModel from "./Ingredient.js";

//Storage Item Schema for MongoDB
const storageItemSchema = new mongoose.Schema({
    storageItemId: { type: Number, required: true, unique: true},
    ingredient: { type: IngredientModel.schema, required: true},
    quantity: { type: Number, required: true},
    unit: { type: String, required: true},
    isLeftover: { type: Boolean, required: true}
});

//ESM export
const StorageItemModel = mongoose.model("StorageItem", storageItemSchema);
export default StorageItemModel;