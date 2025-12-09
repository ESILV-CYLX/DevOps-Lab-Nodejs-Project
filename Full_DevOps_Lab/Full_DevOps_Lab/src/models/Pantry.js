import mongoose from "mongoose";

const pantrySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    quantity: { type: Number, required: true, min: 1 },
});

const Pantry = mongoose.model("Pantry", pantrySchema);

export default Pantry;
