import mongoose from "mongoose";

//Ingredient Schema for embedding
const ingredientSchema = new mongoose.Schema({
    ingredientId: { type: Number, required: true, unique: true},
    name: { type: String, required: true},
    category: { type: String, required: true},
    price: { type: Number, required: true}
});

//ESM export
const IngredientModel = mongoose.model("Ingredient", ingredientSchema);
export default IngredientModel;