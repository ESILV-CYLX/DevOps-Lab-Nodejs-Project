// Liste des ingrédients disponibles (Simulation de la BDD Ingredient)
// Les catégories doivent correspondre à ton Enum backend (supposé en anglais ou majuscules)

export const ingredientsDB = [
    // MEAT
    { ingredientId: 101, name: "Chicken Breast", category: "MEAT" },
    { ingredientId: 102, name: "Beef Steak", category: "MEAT" },
    { ingredientId: 103, name: "Pork Chop", category: "MEAT" },
    { ingredientId: 104, name: "Bacon", category: "MEAT" },
    
    // VEGETABLE (Je suppose que tu as cette catégorie, sinon mets OTHER)
    { ingredientId: 201, name: "Tomato", category: "VEGETABLE" },
    { ingredientId: 202, name: "Onion", category: "VEGETABLE" },
    { ingredientId: 203, name: "Carrot", category: "VEGETABLE" },
    { ingredientId: 204, name: "Potato", category: "VEGETABLE" },
    { ingredientId: 205, name: "Garlic", category: "VEGETABLE" },
    { ingredientId: 206, name: "Lettuce", category: "VEGETABLE" },

    // FRUIT
    { ingredientId: 301, name: "Apple", category: "FRUIT" },
    { ingredientId: 302, name: "Lemon", category: "FRUIT" },
    { ingredientId: 303, name: "Banana", category: "FRUIT" },

    // DAIRY
    { ingredientId: 401, name: "Milk", category: "DAIRY" },
    { ingredientId: 402, name: "Butter", category: "DAIRY" },
    { ingredientId: 403, name: "Egg", category: "DAIRY" },
    { ingredientId: 404, name: "Cheese", category: "DAIRY" },
    { ingredientId: 405, name: "Cream", category: "DAIRY" },

    // GRAIN / OTHER
    { ingredientId: 501, name: "Rice", category: "GRAIN" },
    { ingredientId: 502, name: "Pasta", category: "GRAIN" },
    { ingredientId: 503, name: "Flour", category: "GRAIN" },
    { ingredientId: 504, name: "Sugar", category: "OTHER" },
    { ingredientId: 505, name: "Salt", category: "OTHER" },
    { ingredientId: 506, name: "Olive Oil", category: "OTHER" }
];

// Extraction des catégories uniques pour le filtre
export const categories = [...new Set(ingredientsDB.map(i => i.category))];

export const units = ["g", "kg", "ml", "cl", "L", "tbsp", "tsp", "pcs", "slice"];