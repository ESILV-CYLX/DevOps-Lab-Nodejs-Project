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

const ingredients = [{ ingredientId: 1, name: "Tomato", category: IngredientCategory.FRUIT, price: 1.2 },
    { ingredientId: 2, name: "Chicken", category: IngredientCategory.MEAT, price: 7.5 },
    { ingredientId: 4, name: "Pork", category: IngredientCategory.MEAT, price: 5.5 },
    { ingredientId: 5, name: "Beef", category: IngredientCategory.MEAT, price: 9.5 },
    { ingredientId: 6, name: "Rabbit", category: IngredientCategory.MEAT, price: 6.5 },
    { ingredientId: 7, name: "Rice", category: IngredientCategory.OTHER, price: 1.5 },
    { ingredientId: 8, name: "Potato", category: IngredientCategory.OTHER, price: 2.5 },
    { ingredientId: 3, name: "Pasta", category: IngredientCategory.OTHER, price: 1.8 },
];

async function seed(){
    await connectDB();

    console.log("Inserting ingredients");
        await IngredientModel.insertMany(ingredientsData);
    

}


seed();