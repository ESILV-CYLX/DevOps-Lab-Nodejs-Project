import Pantry from "../models/Pantry.js";

// Get all pantry items
export async function getPantry() {
    return Pantry.find();
}

// Add or update ingredient
export async function addToPantry(id, quantity) {
    if (quantity <= 0) throw new Error("INVALID_QUANTITY");

    const existing = await Pantry.findOne({ id });

    if (existing) {
        existing.quantity += quantity;
        await existing.save();
        return existing;
    }

    const newIngredient = new Pantry({ id, quantity });
    await newIngredient.save();
    return newIngredient;
}

// Delete ingredient
export async function deleteFromPantry(id) {
    const deleted = await Pantry.findOneAndDelete({ id });
    if (!deleted) throw new Error("NOT_FOUND");
    return deleted;
}
