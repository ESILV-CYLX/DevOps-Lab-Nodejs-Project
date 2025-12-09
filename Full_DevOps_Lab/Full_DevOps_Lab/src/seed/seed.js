import mongoose from "mongoose";
import dotenv from "dotenv";

//models
import IngredientModel from "../models/Ingredient.js";
import RecipeIngredientModel from "../models/RecipeIngredient.js";
import RecipeModel from "../models/Recipe.js";
import RetailCompanyModel from "../models/RetailCompany.js";
import UserModel from "../models/User.js";

//enums
import { IngredientCategory } from "../models/enums/IngredientCategory.js";
import { Day } from "../models/enums/Day.js";
import { MealType } from "../models/enums/MealType.js";
import { StorageType } from "../models/enums/StorageType.js"

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error("Connection error :", err);
        process.exit();
    }
}


const ingredientsData = [
    { ingredientId: 1, name: "Tomato", category: IngredientCategory.FRUIT, price: 1.2 },
    { ingredientId: 2, name: "Chicken", category: IngredientCategory.MEAT, price: 7.5 },
    { ingredientId: 3, name: "Pasta", category: IngredientCategory.OTHER, price: 1.8 },
];

const recipeIngredientsData = [
    {
        recipeIngredientId: 1,
        ingredient: ingredientsData[0],
        unit: "g",
        quantity: 200
    },
    {
        recipeIngredientId: 2,
        ingredient: ingredientsData[1],
        unit: "g",
        quantity: 300,
    },
    {
        recipeIngredientId: 3,
        ingredient: ingredientsData[2],
        unit: "g",
        quantity: 100,
    }
];

const recipesData = [
    {
        recipeId: 1,
        title: "Chicken with tomatoes",
        description: "An easy and delicious chicken recipe.",
        prepTime: "15 min",
        cookTime: "30 min",
        difficulty: 1,
        cuisineType: "French",
        servings: 2,
        tags: ["fast", "easy"],
        instructions: [
            "Cut the tomatoes",
            "Put the chicken with a tomatoes in a pan",
            "Cook and stir until done"
        ],
        privacy: false
    }
];

const retailData = [
    {
        retailId: 1,
        name: "Carrefour",
        password: "carrefour123",
        availability: [ingredientsData[0],ingredientsData[1], ingredientsData[2]]
    }
];

const usersData = [
    {
        userId: 1,
        username: "leon",
        email: "leon@test.com",
        password: "123456",
        dietaryPreferences: ["halal"],
        servingSize: 2
    }
];

async function seed() {
    await connectDB();

    try {
        // console.log("Deleting old data");
        // await IngredientModel.deleteMany();
        // await RecipeIngredientModel.deleteMany();
        // await RecipeModel.deleteMany();
        // await RetailCompanyModel.deleteMany();
        // await UserModel.deleteMany();

        console.log("Inserting ingredients");
        await IngredientModel.insertMany(ingredientsData);

        console.log("Inserting RecipeIngredients");
        await RecipeIngredientModel.insertMany(recipeIngredientsData);

        console.log("Inserting Recipes");
        await RecipeModel.insertMany(recipesData);

        console.log("Inserting RetailCompanies");
        await RetailCompanyModel.insertMany(retailData);

        console.log("Inserting Users");
        await UserModel.insertMany(usersData);

        console.log("Seed upload successful!");
        process.exit();

    } catch (err) {
        console.error("Error during see import:", err);
        process.exit();
    }
}

seed();