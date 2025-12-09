import mongoose from "mongoose";

// MealSlot Schema for MongoDB
const mealSlotSchema = new mongoose.Schema({
    mealSlotId: { type: Number, required: true },
    mealType:   { type: String, required: true },
    day:        { type: String, required: true },
    recipeId:   { type: Number, required: true },
    servings:   { type: Number, required: true }
});

//ESM export
const MealSlotModel = mongoose.model("MealSlot", mealSlotSchema);
export default MealSlotModel;