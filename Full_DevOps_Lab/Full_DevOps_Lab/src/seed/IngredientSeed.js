import mongoose from "mongoose";
import dotenv from "dotenv";

//models
import Ingredient from "../src/models/Ingredient.js";
import { IngredientCategory } from "../src/models/enums/IngredientCategory.js";

dotenv.config()
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Mongo connection error:", err);
        process.exit(1);
    }
}

const ingredients = [//Const à changer prob à voir plus tard.
    // --- FRUIT ---
    { ingredientId: 1, name: "Tomato", category: IngredientCategory.FRUIT, price: 1.20 },
    { ingredientId: 2, name: "Banana", category: IngredientCategory.FRUIT, price: 0.80 },
    { ingredientId: 3, name: "Apple (Gala)", category: IngredientCategory.FRUIT, price: 1.50 },
    { ingredientId: 4, name: "Lemon", category: IngredientCategory.FRUIT, price: 0.60 },
    { ingredientId: 5, name: "Strawberries (Pack)", category: IngredientCategory.FRUIT, price: 3.99 },
    { ingredientId: 6, name: "Avocado", category: IngredientCategory.FRUIT, price: 2.50 },

    // --- VEGETABLE ---
    { ingredientId: 7, name: "Carrot", category: IngredientCategory.VEGETABLE, price: 0.90 },
    { ingredientId: 8, name: "Broccoli", category: IngredientCategory.VEGETABLE, price: 1.80 },
    { ingredientId: 9, name: "Spinach", category: IngredientCategory.VEGETABLE, price: 2.10 },
    { ingredientId: 10, name: "Potato (Red)", category: IngredientCategory.VEGETABLE, price: 1.00 },
    { ingredientId: 11, name: "Onion (Yellow)", category: IngredientCategory.VEGETABLE, price: 0.75 },
    { ingredientId: 12, name: "Bell Pepper", category: IngredientCategory.VEGETABLE, price: 1.30 },

    // --- MEAT ---
    { ingredientId: 13, name: "Chicken Breast", category: IngredientCategory.MEAT, price: 7.50 },
    { ingredientId: 14, name: "Ground Beef", category: IngredientCategory.MEAT, price: 6.20 },
    { ingredientId: 15, name: "Salmon Fillet", category: IngredientCategory.MEAT, price: 9.00 },
    { ingredientId: 16, name: "Pork Chop", category: IngredientCategory.MEAT, price: 5.50 },
    { ingredientId: 17, name: "Bacon", category: IngredientCategory.MEAT, price: 4.80 },
    { ingredientId: 18, name: "Tuna (Canned)", category: IngredientCategory.MEAT, price: 1.50 },

    // --- DAIRY ---
    { ingredientId: 19, name: "Whole Milk", category: IngredientCategory.DAIRY, price: 1.90 },
    { ingredientId: 20, name: "Cheddar Cheese", category: IngredientCategory.DAIRY, price: 4.50 },
    { ingredientId: 21, name: "Butter (Salted)", category: IngredientCategory.DAIRY, price: 3.80 },
    { ingredientId: 22, name: "Greek Yogurt", category: IngredientCategory.DAIRY, price: 1.25 },
    { ingredientId: 23, name: "Heavy Cream", category: IngredientCategory.DAIRY, price: 2.90 },

    // --- GRAIN ---
    { ingredientId: 24, name: "Pasta (Spaghetti)", category: IngredientCategory.GRAIN, price: 1.80 },
    { ingredientId: 25, name: "Basmati Rice", category: IngredientCategory.GRAIN, price: 2.20 },
    { ingredientId: 26, name: "Sourdough Bread", category: IngredientCategory.GRAIN, price: 3.50 },
    { ingredientId: 27, name: "Rolled Oats", category: IngredientCategory.GRAIN, price: 2.00 },
    { ingredientId: 28, name: "Quinoa", category: IngredientCategory.GRAIN, price: 4.10 },
    { ingredientId: 29, name: "Flour (All-Purpose)", category: IngredientCategory.GRAIN, price: 1.60 },

    // --- SPICE ---
    { ingredientId: 30, name: "Sea Salt", category: IngredientCategory.SPICE, price: 0.99 },
    { ingredientId: 31, name: "Black Pepper", category: IngredientCategory.SPICE, price: 3.20 },
    { ingredientId: 32, name: "Cinnamon", category: IngredientCategory.SPICE, price: 2.50 },
    { ingredientId: 33, name: "Paprika", category: IngredientCategory.SPICE, price: 2.10 },
    { ingredientId: 34, name: "Garlic Powder", category: IngredientCategory.SPICE, price: 1.80 },

    // --- OTHER ---
    { ingredientId: 35, name: "Olive Oil", category: IngredientCategory.OTHER, price: 8.50 },
    { ingredientId: 36, name: "Eggs (Dozen)", category: IngredientCategory.OTHER, price: 3.10 },
    { ingredientId: 37, name: "Sugar (White)", category: IngredientCategory.OTHER, price: 1.40 },
    { ingredientId: 38, name: "Honey", category: IngredientCategory.OTHER, price: 5.00 },
    { ingredientId: 39, name: "Soy Sauce", category: IngredientCategory.OTHER, price: 2.80 },
    { ingredientId: 40, name: "Dark Chocolate", category: IngredientCategory.OTHER, price: 2.50 }
];

async function seed(){
    await connectDB();

    try {

    console.log("Inserting ingredients");
    await IngredientModel.insertMany(ingredientsData);
    
    console.log("Seed upload successful!");
    process.exit();

    } catch(err) {
        console.error("Error during see import:", err);
        process.exit();
    }
}
seed();

export default ingredientsData;