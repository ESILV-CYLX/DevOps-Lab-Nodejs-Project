import mongoose from "mongoose";

// Recipe Schema for MongoDB
const recipeSchema = new mongoose.Schema({
    recipeId:    { type: Number, required: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    prepTime:    { type: String, required: true },
    cookTime:    { type: String, required: true },
    difficulty:  { type: Number, required: true },
    cuisineType: { type: String, required: true }, //TODO voir si ici énum ?
    servings:    { type: Number, required: true },
    tags:        { type: [String], default: [] },
    instructions:{ type: [String], default: [] },
    privacy:     { type: Boolean, default: false }
});

//ESM export
const RecipeModel = mongoose.model("Recipe", recipeSchema);
export default RecipeModel;