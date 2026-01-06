import mongoose from "mongoose";
import { CuisineType } from "./enums/CuisineType.js";
import { Flavors } from "./enums/Flavors.js";
import { Units } from "./enums/Units.js";

// Recipe Schema for MongoDB
const recipeSchema = new mongoose.Schema({
    recipeId:    { type: Number, required: true },
    title:       { type: String, required: true },
    description: { type: String, required: false },
    prepTime:    { type: Number, required: true },
    cookTime:    { type: Number, required: true },
    difficulty:  { type: Number, required: true },
    cuisineType: { 
        type: String, 
        required: true,
        enum: Object.values(CuisineType)
    },    
    flavor: { 
        type: String, 
        required: true, 
        enum: Object.values(Flavors)
    },
    servings:    { type: Number, required: true },
    tags:        { type: [String], default: [] },
    instructions:{ type: [String], default: [] },
    privacy:     { type: Boolean, default: false },
    userId:      { type: Number, required: false },
    image:       { type: String, required: true },
    ingredients: {
        type: [{
            ingredientId: { type: Number, required: true },
            name: String,
            quantity: Number,
            unit: { 
                type: String, 
                enum: Object.values(Units)
            }
        }],
        // Valider la présence d'au moins 1 ingrédient
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'A recipe must have at least one ingredient.'
        }
    }
});

//ESM export
const RecipeModel = mongoose.model("Recipe", recipeSchema);
export default RecipeModel;