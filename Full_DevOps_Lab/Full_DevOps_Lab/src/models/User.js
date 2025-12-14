import mongoose from "mongoose";

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
    userId:  { type: Number, required: true, unique: true},
    username: { type: String, required: true, unique: true},
    email:    { type: String, required: true, unique: true},
    password: { type: String, required: true},
    dietaryPreferences: { type: [String], default: []},
    servingSize: { type: Number, default: 1},
    
    // NEW: Array to store the IDs of liked recipes
    savedRecipes: [{ type: Number, ref: 'Recipe' }]
});

//ESM export
const User = mongoose.model("User", userSchema);
export default User;