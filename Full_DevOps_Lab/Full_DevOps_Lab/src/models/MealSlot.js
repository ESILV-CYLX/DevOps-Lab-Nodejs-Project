import mongoose from "mongoose";
import { MealType } from "./enums/MealType.js";
import { Day } from "./enums/Day.js"

// MealSlot Schema for MongoDB
const mealSlotSchema = new mongoose.Schema({
    mealSlotId: { type: Number, required: true },
    mealType: { 
        type: String, 
        enum: Object.values(MealType), 
        required: true 
    },
    day: { 
        type: String, 
        enum: Object.values(Day), 
        required: true 
    },
    recipeId:   { type: Number, required: true },
    servings:   { type: Number, required: true }
});

//ESM export
const MealSlotModel = mongoose.model("MealSlot", mealSlotSchema);
export default MealSlotModel;