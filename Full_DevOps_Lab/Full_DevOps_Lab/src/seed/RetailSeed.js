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

const retailData = [
    {
        retailId: 1,
        name: "Carrefour",
        password: "carrefour123",
        availability: ingredientsData.slice(0, 25)
    },
    {
        retailId: 2,
        name: "E.Leclerc",
        password: "leclerc123",
        availability: ingredientsData.slice(15, 40)
    },
    {
        retailId: 3,
        name: "Auchan",
        password: "auchan123",
        availability: ingredientsData.slice(5, 35)
    },
    {
        retailId: 4,
        name: "Lidl",
        password: "lidl123",
        availability: [
            ...ingredientsData.slice(0, 10), 
            ...ingredientsData.slice(35, 40)
        ]
    },
    {
        retailId: 5,
        name: "Monoprix",
        password: "monoprix123",
        availability: [ingredientsData[0],ingredientsData[2],ingredientsData[3],ingredientsData[4],ingredientsData[5],ingredientsData[6]]
    }
];
//this model works but no dynamic links between ingredient database and retail = no change will pushed between the two
//the answer would be to only map the id of the ingredient but rn not a priority : i'll see the scope of the changes later

//paste of geremi pov:
/*
const retailDataFormatted = retailData.map(company => ({
            ...company,
            // Map the array of objects to an array of just IDs
            availability: company.availability.map(item => item.ingredientId)

*/

async function seed() {
    await connectDB();

    try {
        console.log("Inserting RetailCompanies");
        await RetailCompanyModel.insertMany(retailData);

        console.log("Seed upload successful!");
        process.exit();

    } catch (err) {
        console.error("Error during see import:", err);
        process.exit();
    }
}

seed();

export default retailData;