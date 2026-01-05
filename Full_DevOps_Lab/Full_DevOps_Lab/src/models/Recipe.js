import mongoose from "mongoose";

// Recipe Schema for MongoDB
const recipeSchema = new mongoose.Schema({
    recipeId:    { type: Number, required: true },
    title:       { type: String, required: true },
    description: { type: String, required: false },
    prepTime:    { type: Number, required: true }, // Changé de "String" à "Number"
    cookTime:    { type: Number, required: true }, // Changé de "String" à "Number"
    difficulty:  { type: Number, required: true },
    cuisineType: { type: String, required: true },
    // NEW: Flavor
    flavor:      { type: String, required: true, enum: ["Salty", "Sweet", "Savory", "Spicy", "Mild", "Sweet & Sour", "Umami", "Bitter"] },
    servings:    { type: Number, required: true },
    tags:        { type: [String], default: [] },
    instructions:{ type: [String], default: [] },
    privacy:     { type: Boolean, default: false },
    userId:      { type: Number, required: false },
    
    // NOUVEAU : Image en Base64
    image:       { type: String, required: true },
    
    // NOUVEAU : Ingrédients liés au modèle Ingredient
    ingredients: {
        type: [{
            ingredientId: { type: Number, required: true },
            name: String,
            quantity: Number,
            unit: String
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