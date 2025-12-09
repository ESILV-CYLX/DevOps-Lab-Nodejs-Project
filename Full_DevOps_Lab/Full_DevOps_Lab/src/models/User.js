import mongoose from "mongoose";

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
    userId:  { type: Number, required: true, unique: true},
    username: { type: String, required: true, unique: true},
    email:    { type: String, required: true, unique: true},
    password: { type: String, required: true},
    dietaryPreferences: { type: [String], default: []},
    servingSize: { type: Number, default: 1}
});

//ESM export
const User = mongoose.model("User", userSchema);
export default User;