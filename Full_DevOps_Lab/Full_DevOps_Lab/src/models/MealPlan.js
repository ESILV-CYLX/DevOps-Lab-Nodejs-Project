import mongoose from "mongoose";
import RecipeModel from "./Recipe.js";
import MealSlotModel from "./MealSlot.js";

// MealPlan Schema for MongoDB
const mealPlanSchema = new mongoose.Schema({
    mealPlanId:   { type: Number, required: true, unique: true },
    userId:       { type: Number, required: true },
    weekStartDate:{ type: Date, required: true },
    weekEndDate:  { type: Date, required: true },
    state:        { type: Boolean, default: true },
    privacy:      { type: Boolean, default: false },
    recipes:      { type: [RecipeModel.schema], default: [] }, // Array of Recipes objects
    mealSlots:    { type: [MealSlotModel.schema], default: [] }  // Array of MealSlot objects
});

//ESM export
const MealPlanModel = mongoose.model("MealPlan", mealPlanSchema);
export default MealPlanModel;