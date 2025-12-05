import mongoose from "mongoose";
import IngredientModel from "./Ingredient.js";

//Retail Company Schema for MongoDB
const retailCompanySchema = new mongoose.Schema({
    retailId: { type: Number, required: true, unique: true},
    name: { type: String, required: true},
    password: { type: String, required: true},
    availability: { type: [IngredientModel.schema], default: []}
});

//ESM export
const RetailCompanyModel = mongoose.model("RetailCompany", retailCompanySchema);
export default RetailCompanyModel;