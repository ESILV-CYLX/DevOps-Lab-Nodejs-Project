import mongoose from "mongoose";
import dotenv from "dotenv";

import RetailCompanyModel from "../models/RetailCompany.js";

import Ingredient from "../src/models/Ingredient.js";
import {ingredientsData} from "../seed/IngredientSeed.js";
import { IngredientCategory } from "../src/models/enums/IngredientCategory.js";

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

const usersData = [
    {
        userId: 1,
        username: "leon",
        email: "leon@test.com",
        password: "123456",
        dietaryPreferences: ["halal"],
        servingSize: 2
    },
    {
        userId: 2,
        username: "sarah_v",
        email: "sarah.vegan@test.com",
        password: "password123",
        dietaryPreferences: ["vegan"],
        servingSize: 1
    },
    {
        userId: 3,
        username: "mike_gf",
        email: "mike.glutenfree@test.com",
        password: "securePass!",
        dietaryPreferences: ["gluten-free"],
        servingSize: 4
    },
    {
        userId: 4,
        username: "emily_fam",
        email: "emily.family@test.com",
        password: "familypass",
        dietaryPreferences: [], 
        servingSize: 6
    },
    {
        userId: 5,
        username: "david_allergies",
        email: "david.safe@test.com",
        password: "nomilkornuts",
        dietaryPreferences: ["dairy-free", "nut-free"],
        servingSize: 2
    },
    {
        userId: 6,
        username: "jessica_veg",
        email: "jess.veggie@test.com",
        password: "greenlife",
        dietaryPreferences: ["vegetarian"],
        servingSize: 3
    },
    {
        userId: 7,
        username: "chris_keto",
        email: "chris.gains@test.com",
        password: "lowcarb123",
        dietaryPreferences: ["keto", "sugar-free"],
        servingSize: 1
    },
    {
        userId: 8,
        username: "amanda_fish",
        email: "amanda.pesc@test.com",
        password: "oceanview",
        dietaryPreferences: ["pescatarian"],
        servingSize: 2
    },
    {
        userId: 9,
        username: "daniel_k",
        email: "dan.kosher@test.com",
        password: "tradition",
        dietaryPreferences: ["kosher"],
        servingSize: 5
    },
    {
        userId: 10,
        username: "olivia_fodmap",
        email: "liv.sensitive@test.com",
        password: "stomachsafe",
        dietaryPreferences: ["low-fodmap", "lactose-free"],
        servingSize: 1
    },
    {
        userId: 11,
        username: "james_paleo",
        email: "james.caveman@test.com",
        password: "ancestral",
        dietaryPreferences: ["paleo"],
        servingSize: 2
    },
    {
        userId: 12,
        username: "sophia_soy",
        email: "sophia.soyfree@test.com",
        password: "soyfree123",
        dietaryPreferences: ["soy-free"],
        servingSize: 4
    },
    {
        userId: 13,
        username: "raj_hindu",
        email: "raj.beef.free@test.com",
        password: "nobeef",
        dietaryPreferences: ["beef-free", "pork-free"],
        servingSize: 4
    },
    {
        userId: 14,
        username: "test_admin",
        email: "admin@test.com",
        password: "adminpassword",
        dietaryPreferences: ["vegan", "gluten-free", "nut-free", "soy-free"],
        servingSize: 10
    },
    {
        userId: 15,
        username: "new_user",
        email: "newbie@test.com",
        password: "changeme",
        dietaryPreferences: [],
        servingSize: 1 
    }
];

async function seed() {
    await connectDB();

    try {
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

export default usersData;