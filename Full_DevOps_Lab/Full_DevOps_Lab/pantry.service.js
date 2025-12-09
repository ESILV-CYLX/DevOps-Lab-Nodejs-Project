import { pantry, updatePantry } from "../data/pantry.data.js";

export function getPantry() {
    return pantry;
}

export function addToPantry(id, quantity) {
    if (quantity <= 0) throw new Error("INVALID_QUANTITY");

    const index = pantry.findIndex(item => item.id === id);

    if (index !== -1) {
        pantry[index].quantity += quantity;
        return pantry[index];
    }

    const newIngredient = { id, quantity };
    pantry.push(newIngredient);
    return newIngredient;
}

export function deleteFromPantry(id) {
    const index = pantry.findIndex(item => item.id === id);
    if (index === -1) throw new Error("NOT_FOUND");

    pantry.splice(index, 1);
}
