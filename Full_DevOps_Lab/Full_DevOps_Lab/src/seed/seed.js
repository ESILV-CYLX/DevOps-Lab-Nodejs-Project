// The whole original database
// Can be re created by removing all comments and running 'node src/seed/seed.js' in the terminal
import mongoose from "mongoose";
import dotenv from "dotenv";

import IngredientModel from "../models/Ingredient.js";
import RecipeModel from "../models/Recipe.js";
import RetailCompanyModel from "../models/RetailCompany.js";
import { IngredientCategory } from "../models/enums/IngredientCategory.js";

dotenv.config({ path: "../.env" });
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
    // MEAT & POULTRY
    { ingredientId: 101, name: "Chicken Breast", category: IngredientCategory.MEAT, price: 6.5 },
    { ingredientId: 102, name: "Steak", category: IngredientCategory.MEAT, price: 9.5 },
    { ingredientId: 103, name: "Pork Chop", category: IngredientCategory.MEAT, price: 7.0 },
    { ingredientId: 104, name: "Bacon", category: IngredientCategory.MEAT, price: 4.5 },
    { ingredientId: 105, name: "Sausage", category: IngredientCategory.MEAT, price: 5.0 },
    { ingredientId: 106, name: "Turkey", category: IngredientCategory.MEAT, price: 6.0 },
    { ingredientId: 107, name: "Lamb", category: IngredientCategory.MEAT, price: 10.0 },
    { ingredientId: 108, name: "Ham", category: IngredientCategory.MEAT, price: 5.5 },
    { ingredientId: 109, name: "Duck", category: IngredientCategory.MEAT, price: 8.0 },
    { ingredientId: 110, name: "Veal", category: IngredientCategory.MEAT, price: 11.0 },
    { ingredientId: 111, name: "Salami", category: IngredientCategory.MEAT, price: 6.0 },
    { ingredientId: 112, name: "Prosciutto", category: IngredientCategory.MEAT, price: 7.5 },
    { ingredientId: 113, name: "Ground Beef", category: IngredientCategory.MEAT, price: 8.0 },
    { ingredientId: 114, name: "Chicken Thigh", category: IngredientCategory.MEAT, price: 5.5 },
    { ingredientId: 115, name: "Pork Belly", category: IngredientCategory.MEAT, price: 7.0 },
    { ingredientId: 116, name: "Corned Beef", category: IngredientCategory.MEAT, price: 6.5 },
    { ingredientId: 117, name: "Ribs", category: IngredientCategory.MEAT, price: 9.0 },
    { ingredientId: 118, name: "Meatballs", category: IngredientCategory.MEAT, price: 5.0 },
    { ingredientId: 119, name: "Chicken Wings", category: IngredientCategory.MEAT, price: 6.0 },

    // VEGETABLES & GREENS
    { ingredientId: 201, name: "Tomato", category: IngredientCategory.VEGETABLE, price: 1.2 },
    { ingredientId: 202, name: "Onion", category: IngredientCategory.VEGETABLE, price: 0.8 },
    { ingredientId: 203, name: "Carrot", category: IngredientCategory.VEGETABLE, price: 0.6 },
    { ingredientId: 204, name: "Potato", category: IngredientCategory.VEGETABLE, price: 0.5 },
    { ingredientId: 205, name: "Garlic", category: IngredientCategory.VEGETABLE, price: 0.4 },
    { ingredientId: 206, name: "Lettuce", category: IngredientCategory.VEGETABLE, price: 1.0 },
    { ingredientId: 207, name: "Cucumber", category: IngredientCategory.VEGETABLE, price: 0.9 },
    { ingredientId: 208, name: "Bell Pepper", category: IngredientCategory.VEGETABLE, price: 1.3 },
    { ingredientId: 209, name: "Spinach", category: IngredientCategory.VEGETABLE, price: 1.5 },
    { ingredientId: 210, name: "Mushrooms", category: IngredientCategory.VEGETABLE, price: 2.0 },
    { ingredientId: 211, name: "Broccoli", category: IngredientCategory.VEGETABLE, price: 1.8 },
    { ingredientId: 212, name: "Cauliflower", category: IngredientCategory.VEGETABLE, price: 1.7 },
    { ingredientId: 213, name: "Zucchini", category: IngredientCategory.VEGETABLE, price: 1.4 },
    { ingredientId: 214, name: "Eggplant", category: IngredientCategory.VEGETABLE, price: 1.6 },
    { ingredientId: 215, name: "Celery", category: IngredientCategory.VEGETABLE, price: 0.7 },
    { ingredientId: 216, name: "Asparagus", category: IngredientCategory.VEGETABLE, price: 2.5 },
    { ingredientId: 217, name: "Cabbage", category: IngredientCategory.VEGETABLE, price: 1.1 },
    { ingredientId: 218, name: "Brussels Sprouts", category: IngredientCategory.VEGETABLE, price: 2.3 },
    { ingredientId: 219, name: "Kale", category: IngredientCategory.VEGETABLE, price: 2.1 },
    { ingredientId: 220, name: "Corn", category: IngredientCategory.VEGETABLE, price: 1.9 },
    { ingredientId: 221, name: "Chickpeas", category: IngredientCategory.VEGETABLE, price: 1.4 },
    { ingredientId: 222, name: "Green Beans", category: IngredientCategory.VEGETABLE, price: 1.6 },
    { ingredientId: 223, name: "Radish", category: IngredientCategory.VEGETABLE, price: 0.9 },
    { ingredientId: 224, name: "Beetroot", category: IngredientCategory.VEGETABLE, price: 1.2 },
    { ingredientId: 225, name: "Pumpkin", category: IngredientCategory.VEGETABLE, price: 1.8 },
    { ingredientId: 226, name: "Avocado", category: IngredientCategory.VEGETABLE, price: 2 },
    { ingredientId: 227, name: "Ginger", category: IngredientCategory.VEGETABLE, price: 1.1 },


    // FRUITS
    { ingredientId: 301, name: "Apple", category: IngredientCategory.FRUIT, price: 1.0 },
    { ingredientId: 302, name: "Lemon", category: IngredientCategory.FRUIT, price: 0.9 },
    { ingredientId: 303, name: "Banana", category: IngredientCategory.FRUIT, price: 1.1 },
    { ingredientId: 304, name: "Blueberry", category: IngredientCategory.FRUIT, price: 1.8 },
    { ingredientId: 305, name: "Grapes", category: IngredientCategory.FRUIT, price: 2.3 },
    { ingredientId: 306, name: "Lime", category: IngredientCategory.FRUIT, price: 0.75 },
    { ingredientId: 307, name: "Mango", category: IngredientCategory.FRUIT, price: 5.0 },
    { ingredientId: 308, name: "Orange", category: IngredientCategory.FRUIT, price: 2.5 },
    { ingredientId: 309, name: "Pineapple", category: IngredientCategory.FRUIT, price: 6.2 },
    { ingredientId: 310, name: "Strawberry", category: IngredientCategory.FRUIT, price: 4.0 },

    // SEAFOOD
    { ingredientId: 401, name: "Shrimp", category: IngredientCategory.SEAFOOD, price: 14.0 },
    { ingredientId: 402, name: "Tuna", category: IngredientCategory.SEAFOOD, price: 13.0 },
    { ingredientId: 403, name: "Cod", category: IngredientCategory.SEAFOOD, price: 11.0 },
    { ingredientId: 404, name: "Lobster", category: IngredientCategory.SEAFOOD, price: 25.0 },
    { ingredientId: 405, name: "Crab", category: IngredientCategory.SEAFOOD, price: 22.0 },
    { ingredientId: 406, name: "Oyster", category: IngredientCategory.SEAFOOD, price: 18.0 },
    { ingredientId: 407, name: "Clams", category: IngredientCategory.SEAFOOD, price: 12.0 },
    { ingredientId: 408, name: "Mussels", category: IngredientCategory.SEAFOOD, price: 10.0 },
    { ingredientId: 409, name: "Scallops", category: IngredientCategory.SEAFOOD, price: 20.0 },
    { ingredientId: 410, name: "Sardines", category: IngredientCategory.SEAFOOD, price: 9.0 },
    { ingredientId: 411, name: "Anchovies", category: IngredientCategory.SEAFOOD, price: 8.0 },
    { ingredientId: 412, name: "Trout", category: IngredientCategory.SEAFOOD, price: 15.0 },
    { ingredientId: 413, name: "Halibut", category: IngredientCategory.SEAFOOD, price: 17.0 },
    { ingredientId: 414, name: "Sea Bass", category: IngredientCategory.SEAFOOD, price: 19.0 },
    { ingredientId: 415, name: "Haddock", category: IngredientCategory.SEAFOOD, price: 13.5 },
    { ingredientId: 416, name: "Catfish", category: IngredientCategory.SEAFOOD, price: 12.5 },
    { ingredientId: 417, name: "Calamari", category: IngredientCategory.SEAFOOD, price: 16.0 },
    { ingredientId: 418, name: "Caviar", category: IngredientCategory.SEAFOOD, price: 30.0 },
    { ingredientId: 419, name: "Octopus", category: IngredientCategory.SEAFOOD, price: 21.0 },
    { ingredientId: 420, name: "Squid", category: IngredientCategory.SEAFOOD, price: 14.5 },
    { ingredientId: 421, name: "Crayfish", category: IngredientCategory.SEAFOOD, price: 23.0 },
    { ingredientId: 422, name: "Fish Fillet", category: IngredientCategory.SEAFOOD, price: 12.0 },
    { ingredientId: 423, name: "Prawns", category: IngredientCategory.SEAFOOD, price: 15.5 },
    { ingredientId: 424, name: "Swordfish", category: IngredientCategory.SEAFOOD, price: 18.0 },
    { ingredientId: 425, name: "Salmon", category: IngredientCategory.SEAFOOD, price: 16.5 },
    { ingredientId: 426, name: "Barramundi", category: IngredientCategory.SEAFOOD, price: 19.5 },
    { ingredientId: 427, name: "Grouper", category: IngredientCategory.SEAFOOD, price: 20.0 },
    { ingredientId: 428, name: "Tilapia", category: IngredientCategory.SEAFOOD, price: 11.5 },
    { ingredientId: 429, name: "Flounder", category: IngredientCategory.SEAFOOD, price: 13.0 },
    
    // DAIRY
    { ingredientId: 501, name: "Milk", category: IngredientCategory.DAIRY, price: 1.3 },
    { ingredientId: 502, name: "Butter", category: IngredientCategory.DAIRY, price: 2.2 },
    { ingredientId: 503, name: "Eggs", category: IngredientCategory.DAIRY, price: 0.3 },
    { ingredientId: 504, name: "Cheese", category: IngredientCategory.DAIRY, price: 2.8 },
    { ingredientId: 505, name: "Cream", category: IngredientCategory.DAIRY, price: 1.9 },
    { ingredientId: 506, name: "Yogurt", category: IngredientCategory.DAIRY, price: 1.5 },
    { ingredientId: 507, name: "Ice Cream", category: IngredientCategory.DAIRY, price: 3.0 },
    { ingredientId: 508, name: "Sour Cream", category: IngredientCategory.DAIRY, price: 1.7 },
    { ingredientId: 509, name: "Cottage Cheese", category: IngredientCategory.DAIRY, price: 2.4 },
    { ingredientId: 510, name: "Whipped Cream", category: IngredientCategory.DAIRY, price: 2.1 },
    { ingredientId: 511, name: "Cheddar", category: IngredientCategory.DAIRY, price: 4.0 },
    { ingredientId: 512, name: "Mozzarella", category: IngredientCategory.DAIRY, price: 3.8 },
    { ingredientId: 513, name: "Condensed Milk", category: IngredientCategory.DAIRY, price: 2.3 },
    { ingredientId: 514, name: "Powdered Milk", category: IngredientCategory.DAIRY, price: 3.2 },
    { ingredientId: 515, name: "Buttermilk", category: IngredientCategory.DAIRY, price: 1.6 },
    { ingredientId: 516, name: "Parmesan", category: IngredientCategory.DAIRY, price: 5.0 },

    // GRAINS & BREAD
    { ingredientId: 601, name: "Rice", category: IngredientCategory.GRAIN, price: 1.5 },
    { ingredientId: 602, name: "Pasta", category: IngredientCategory.GRAIN, price: 1.4 },
    { ingredientId: 603, name: "Flour", category: IngredientCategory.GRAIN, price: 1.2 },
    { ingredientId: 604, name: "Bread", category: IngredientCategory.GRAIN, price: 2.0 },
    { ingredientId: 605, name: "Oats", category: IngredientCategory.GRAIN, price: 1.8 },
    { ingredientId: 606, name: "Quinoa", category: IngredientCategory.GRAIN, price: 3.5 },
    { ingredientId: 607, name: "Barley", category: IngredientCategory.GRAIN, price: 2.2 },
    { ingredientId: 608, name: "Cornmeal", category: IngredientCategory.GRAIN, price: 1.9 },
    { ingredientId: 609, name: "Couscous", category: IngredientCategory.GRAIN, price: 2.4 },
    { ingredientId: 610, name: "Rye Bread", category: IngredientCategory.GRAIN, price: 2.5 },
    { ingredientId: 611, name: "Breadcrumbs", category: IngredientCategory.GRAIN, price: 0.0 },
    { ingredientId: 612, name: "Bagel", category: IngredientCategory.GRAIN, price: 1.7 },
    { ingredientId: 613, name: "Croissant", category: IngredientCategory.GRAIN, price: 2.1 },
    { ingredientId: 614, name: "Tortilla", category: IngredientCategory.GRAIN, price: 1.6 },
    { ingredientId: 615, name: "Pita Bread", category: IngredientCategory.GRAIN, price: 1.8 },
    { ingredientId: 616, name: "Noodles", category: IngredientCategory.GRAIN, price: 2.3 },
    { ingredientId: 617, name: "Spaghetti", category: IngredientCategory.GRAIN, price: 2.6 },
    { ingredientId: 618, name: "Macaroni", category: IngredientCategory.GRAIN, price: 2.0 },
    { ingredientId: 619, name: "Rice Flour", category: IngredientCategory.GRAIN, price: 2.7 },
    { ingredientId: 620, name: "Toast", category: IngredientCategory.GRAIN, price: 2.8 },
    { ingredientId: 621, name: "Sushi Rice", category: IngredientCategory.GRAIN, price: 2.9 },

    // PANTRY & SPICES
    { ingredientId: 701, name: "Olive Oil", category: IngredientCategory.SPICE, price: 3.5 },
    { ingredientId: 702, name: "Vinegar", category: IngredientCategory.SPICE, price: 1.8 },
    { ingredientId: 703, name: "Soy Sauce", category: IngredientCategory.SPICE, price: 2.2 },
    { ingredientId: 704, name: "Honey", category: IngredientCategory.SPICE, price: 4.0 },
    { ingredientId: 705, name: "Mustard", category: IngredientCategory.SPICE, price: 1.5 },
    { ingredientId: 706, name: "Ketchup", category: IngredientCategory.SPICE, price: 1.3 },
    { ingredientId: 707, name: "Mayonnaise", category: IngredientCategory.SPICE, price: 1.6 },
    { ingredientId: 708, name: "Cinnamon", category: IngredientCategory.SPICE, price: 0.8 },
    { ingredientId: 709, name: "Black Pepper", category: IngredientCategory.SPICE, price: 0.7 },
    { ingredientId: 710, name: "Paprika", category: IngredientCategory.SPICE, price: 0.9 },
    { ingredientId: 711, name: "Cumin", category: IngredientCategory.SPICE, price: 1.0 },
    { ingredientId: 712, name: "Turmeric", category: IngredientCategory.SPICE, price: 1.1 },
    { ingredientId: 713, name: "Chili Powder", category: IngredientCategory.SPICE, price: 1.2 },
    { ingredientId: 714, name: "Oregano", category: IngredientCategory.SPICE, price: 0.6 },
    { ingredientId: 715, name: "Thyme", category: IngredientCategory.SPICE, price: 0.4 },
    { ingredientId: 716, name: "Rosemary", category: IngredientCategory.SPICE, price: 0.9 },
    { ingredientId: 717, name: "Cloves", category: IngredientCategory.SPICE, price: 1.4 },
    { ingredientId: 718, name: "Nutmeg", category: IngredientCategory.SPICE, price: 1.5 },
    { ingredientId: 719, name: "Baking Powder", category: IngredientCategory.SPICE, price: 1.2 },
    { ingredientId: 720, name: "Broth", category: IngredientCategory.SPICE, price: 1.0 },
    { ingredientId: 721, name: "Salt", category: IngredientCategory.SPICE, price: 2.5 },
    { ingredientId: 722, name: "Sugar", category: IngredientCategory.SPICE, price: 0.9 },
    { ingredientId: 723, name: "Tomato Sauce", category: IngredientCategory.SPICE, price: 1.1 },
    { ingredientId: 724, name: "Vanilla Extract", category: IngredientCategory.SPICE, price: 2.8 },
    { ingredientId: 725, name: "Vegetable Oil", category: IngredientCategory.SPICE, price: 1.9 },
    { ingredientId: 726, name: "Capers", category: IngredientCategory.SPICE, price: 1.3 },
    { ingredientId: 727, name: "Worcestershire Sauce", category: IngredientCategory.SPICE, price: 3.3 },
    { ingredientId: 728, name: "Tahini", category: IngredientCategory.SPICE, price: 4.6 },

    // HERBS
    { ingredientId: 801, name: "Parsley", category: IngredientCategory.HERBS, price: 0.5 },
    { ingredientId: 802, name: "Cilantro", category: IngredientCategory.HERBS, price: 0.6 },
    { ingredientId: 803, name: "Dill", category: IngredientCategory.HERBS, price: 0.7 },
    { ingredientId: 804, name: "Chives", category: IngredientCategory.HERBS, price: 0.8 },
    { ingredientId: 805, name: "Mint", category: IngredientCategory.HERBS, price: 0.9 },
    { ingredientId: 806, name: "Sage", category: IngredientCategory.HERBS, price: 1.0 },
    { ingredientId: 807, name: "Tarragon", category: IngredientCategory.HERBS, price: 1.1 },
    { ingredientId: 808, name: "Fennel", category: IngredientCategory.HERBS, price: 1.2 },
    { ingredientId: 809, name: "Lemongrass", category: IngredientCategory.HERBS, price: 1.3 },
    { ingredientId: 810, name: "Curry Leaves", category: IngredientCategory.HERBS, price: 1.4 },
    { ingredientId: 811, name: "Basil", category: IngredientCategory.HERBS, price: 0.4 },
    { ingredientId: 812, name: "Rosemary", category: IngredientCategory.HERBS, price: 0.5 },
    { ingredientId: 813, name: "Oregano", category: IngredientCategory.HERBS, price: 0.6 },
    { ingredientId: 814, name: "Thyme", category: IngredientCategory.HERBS, price: 0.7 },
    { ingredientId: 815, name: "Fresh Herbs", category: IngredientCategory.HERBS, price: 0.8 },

    // OTHERS
    { ingredientId: 901, name: "Tofu", category: IngredientCategory.OTHER, price: 2.5 },
    { ingredientId: 902, name: "Black Bean Paste", category: IngredientCategory.OTHER, price: 3.0 },
    { ingredientId: 903, name: "Nori", category: IngredientCategory.OTHER, price: 2.8 },
];

const recipesData = [
    {
        recipeId: 1,
        title: "Spaghetti Carbonara",
        description: "Classic Italian pasta dish",
        prepTime: 15,
        cookTime: 20,
        difficulty: 1,
        cuisineType: "Italian",
        flavor: "Salty",
        isVegetarian:false,
        isGlutenFree:false,
        isLactoseFree:false,
        servings: 2,
        tags: ["pasta", "fast"],
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3",
        instructions: [
            "Cook pasta",
            "Fry bacon",
            "Mix eggs and cheese",
            "Combine everything"
        ],
        ingredients: [
            { ingredientId: 602, name: "Pasta", quantity: 200, unit: "g" },
            { ingredientId: 104, name: "Bacon", quantity: 100, unit: "g" },
            { ingredientId: 503, name: "Eggs", quantity: 2, unit: "pcs" },
            { ingredientId: 504, name: "Cheese", quantity: 50, unit: "g" }
        ],
        privacy: false
    },
    {
        recipeId: 2,
        title: "Chicken Rice Bowl",
        description: "Healthy chicken with rice",
        prepTime: 20,
        cookTime: 25,
        difficulty: 1,
        cuisineType: "Asian",
        flavor: "Salty",
        isVegetarian:false,
        isGlutenFree:true,
        isLactoseFree:true,
        servings: 2,
        tags: ["healthy", "protein"],
        image: "https://imgs.search.brave.com/R7HVAuBO-zNiPCf7Oxyyahtf0fSdF3LHXZD4Seju7uk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMXZi/bjcwbG1uMW5xZS5j/bG91ZGZyb250Lm5l/dC9wcm9kL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIzLzA3LzE0/MDgyOTQ3L0luaS1S/ZXNlcC1SaWNlLUJv/d2wtU2VoYXQtZGFu/LVBhZGF0LU51dHJp/c2ktdW50dWstQmVr/YWwtLmpwZy53ZWJw",
        instructions: [
            "Cook rice",
            "Grill chicken",
            "Assemble bowl"
        ],
        ingredients: [
            { ingredientId: 101, name: "Chicken Breast", quantity: 250, unit: "g" },
            { ingredientId: 601, name: "Rice", quantity: 150, unit: "g" },
            { ingredientId: 701, name: "Olive Oil", quantity: 1, unit: "tbsp" }
        ],
        privacy: false
    },
    {
        recipeId: 3,
        title: "Jajangmyeon",
        description: "Noodles with black bean sauce, a classic Korean comfort dish",
        prepTime: 20,
        cookTime: 25,
        difficulty: 3,
        cuisineType: "Korean",
        flavor: "Savory",
        isVegetarian:false,
        isGlutenFree:true,
        isLactoseFree:true,
        servings: 2,
        tags: ["noodles", "comfort food"],
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733",
        instructions: [
            "Fry the black bean paste with oil until fragrant.",
            "Add diced pork and vegetables, cook until tender.",
            "Mix everything with the cooked noodles.",
            "Serve hot with sliced cucumber."
        ],
        ingredients: [
            { ingredientId: 616, name: "Noodles", quantity: 200, unit: "g" },
            { ingredientId: 902, name: "Black Bean Paste", quantity: 50, unit: "g" },
            { ingredientId: 103, name: "Pork Chop", quantity: 150, unit: "g" },
            { ingredientId: 202, name: "Onion", quantity: 1, unit: "pcs" },
            { ingredientId: 213, name: "Zucchini", quantity: 1, unit: "pcs" },
            { ingredientId: 207, name: "Cucumber", quantity: 50, unit: "g" }
        ],
        privacy: false
    },
    {
        recipeId: 4,
        title: "Bánh Xèo",
        description: "Crispy Vietnamese pancake filled with shrimp and pork",
        prepTime: 15,
        cookTime: 15,
        difficulty: 2,
        cuisineType: "Vietnamese",
        flavor: "Savory",
        isVegetarian:false,
        isGlutenFree:true,
        isLactoseFree:true,
        servings: 2,
        tags: ["street food", "pancake"],
        image: "https://images.unsplash.com/photo-1632288349277-22687c71d643",
        instructions: [
            "Mix rice flour, turmeric, and water to make the batter.",
            "Cook the pancake in a hot pan, add shrimp and pork.",
            "Fold in half and serve with fresh herbs and fish sauce."
        ],
        ingredients: [
            { ingredientId: 619, name: "Rice Flour", quantity: 100, unit: "g" },
            { ingredientId: 712, name: "Turmeric", quantity: 1, unit: "tsp" },
            { ingredientId: 401, name: "Shrimp", quantity: 100, unit: "g" },
            { ingredientId: 103, name: "Pork Chop", quantity: 100, unit: "g" },
            { ingredientId: 223, name: "Bean Sprouts", quantity: 50, unit: "g" },
            { ingredientId: 815, name: "Fresh Herbs", quantity: 10, unit: "g" }
        ],
        privacy: false
    },
    {
        recipeId: 5,
        title: "Beef Tartare",
        description: "Classic French raw beef dish with egg yolk and capers",
        prepTime: 20,
        cookTime: 0,
        difficulty: 2,
        cuisineType: "French",
        flavor: "Savory",
        isVegetarian:false,
        isGlutenFree:false,
        isLactoseFree:true,
        servings: 2,
        tags: ["raw", "gourmet"],
        image: "https://imgs.search.brave.com/Z5_U8onRX63m6Xtdr7GPMgWnt9bW8zCamzvuGcxMVPs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTA5/NTI1NzE2L2ZyL3Bo/b3RvL2hlcmJlcy1v/ZXVmcy1ldC12aWFu/ZGUtaGFjaCVDMyVB/OWUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPUh6R000Y19K/ODF2NlpxSlFLTmpI/c05VSUVERy1CdjRD/RUFJLWk1UXV4MDA9",
        instructions: [
            "Finely chop the beef with a knife.",
            "Mix with egg yolk, capers, onions, and Worcestershire sauce.",
            "Season with salt and pepper.",
            "Serve chilled with toast."
        ],
        ingredients: [
            { ingredientId: 113, name: "Ground Beef", quantity: 200, unit: "g" },
            { ingredientId: 503, name: "Eggs", quantity: 1, unit: "pcs" },
            { ingredientId: 726, name: "Capers", quantity: 10, unit: "g" },
            { ingredientId: 202, name: "Onion", quantity: 20, unit: "g" },
            { ingredientId: 727, name: "Worcestershire Sauce", quantity: 1, unit: "tsp" },
            { ingredientId: 620, name: "Toast", quantity: 2, unit: "slices" }
        ],
        privacy: false
    },
    {
        recipeId: 6,
        title: "Chicken Tikka Masala",
        description: "Popular Indian dish with marinated chicken in spiced curry sauce",
        prepTime: 20,
        cookTime: 30,
        difficulty: 2,
        cuisineType: "Indian",
        flavor: "Spicy",
        isVegetarian:false,
        isGlutenFree:true,
        isLactoseFree:false,
        servings: 4,
        tags: ["curry", "chicken"],
        image: "https://imgs.search.brave.com/UOkvAjtUW1RkZz74RDV-UT3gwqH37584F8wlm1ZnqQA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDEv/NzE1LzE1Mi9zbWFs/bC9jaGlja2VuLXRp/a2thLW1hc2FsYS1z/cGljeS1jdXJyeS1t/ZWF0LWZvb2Qtd2l0/aC1yb3RpLW9yLW5h/YW4tYnJlYWQtcGhv/dG8uanBn",
        instructions: [
            "Marinate chicken in yogurt and spices for 1 hour.",
            "Grill or bake the chicken until cooked.",
            "Prepare the curry sauce with tomatoes, cream, and spices.",
            "Combine chicken and sauce, simmer for 10 minutes."
        ],
        ingredients: [
            { ingredientId: 101, name: "Chicken Breast", quantity: 500, unit: "g" },
            { ingredientId: 506, name: "Yogurt", quantity: 150, unit: "g" },
            { ingredientId: 711, name: "Cumin", quantity: 1, unit: "tsp" },
            { ingredientId: 713, name: "Chili Powder", quantity: 1, unit: "tsp" },
            { ingredientId: 712, name: "Turmeric", quantity: 1, unit: "tsp" },
            { ingredientId: 723, name: "Tomato Sauce", quantity: 200, unit: "ml" },
            { ingredientId: 505, name: "Cream", quantity: 100, unit: "ml" }
        ],
        privacy: false
    },
    {
        recipeId: 7,
        title: "Paella Valenciana",
        description: "Traditional Spanish rice dish with seafood and chicken",
        prepTime: 20,
        cookTime: 30,
        difficulty: 3,
        cuisineType: "Spanish",
        flavor: "Savory",
        isVegetarian:false,
        isGlutenFree:true,
        isLactoseFree:true,
        servings: 4,
        tags: ["rice", "seafood"],
        image: "https://imgs.search.brave.com/cFL9VW8idh4YwmC4FeggAaUebp08VokKXyK2HCKkTX8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMw/NDEwNTg5MS9mci9w/aG90by90eXBpY2Fs/LXBhZWxsYS12YWxl/bmNpYW5hLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1yQW93/U3ljOTc1TUFGdEFs/bVRKU2ZTb1FvbG9J/Z0V4dlZhQS05Ny0x/NnlBPQ",
        instructions: [
            "Sauté chicken and seafood in olive oil.",
            "Add rice and saffron, stir well.",
            "Pour in broth and cook until rice is tender.",
            "Garnish with lemon and serve."
        ],
        ingredients: [
            { ingredientId: 601, name: "Rice", quantity: 300, unit: "g" },
            { ingredientId: 101, name: "Chicken Breast", quantity: 200, unit: "g" },
            { ingredientId: 401, name: "Shrimp", quantity: 150, unit: "g" },
            { ingredientId: 408, name: "Mussels", quantity: 100, unit: "g" },
            { ingredientId: 202, name: "Onion", quantity: 1, unit: "pcs" },
            { ingredientId: 205, name: "Garlic", quantity: 2, unit: "cloves" },
            { ingredientId: 701, name: "Olive Oil", quantity: 30, unit: "ml" },
            { ingredientId: 720, name: "Broth", quantity: 500, unit: "ml" },
            { ingredientId: 302, name: "Lemon", quantity: 1, unit: "pcs" }
        ],
        privacy: false
    },
    {
        recipeId: 8,
        title: "Moussaka",
        description: "Greek layered dish with eggplant, spiced meat, and béchamel sauce",
        prepTime: 30,
        cookTime: 45,
        difficulty: 3,
        cuisineType: "Greek",
        flavor: "Savory",
        isVegetarian:false,
        isGlutenFree:true,
        isLactoseFree:false,
        servings: 6,
        tags: ["casserole", "comfort food"],
        image: "https://imgs.search.brave.com/y2p0Yv468_TN8mJ2UI1opomovSwPNV6PqMf8lTuKX-Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE0Lzk0LzIwLzQ1/LzM2MF9GXzE0OTQy/MDQ1ODNfc2VMT21H/dW9penlna2g4cG1R/dXdFSnROZkxoWUo2/eHAuanBn",
        instructions: [
            "Slice and salt eggplant, then fry until golden.",
            "Cook ground beef with onions, garlic, and spices.",
            "Layer eggplant and meat in a baking dish.",
            "Top with béchamel sauce and bake until golden."
        ],
        ingredients: [
            { ingredientId: 214, name: "Eggplant", quantity: 2, unit: "pcs" },
            { ingredientId: 113, name: "Ground Beef", quantity: 300, unit: "g" },
            { ingredientId: 202, name: "Onion", quantity: 1, unit: "pcs" },
            { ingredientId: 205, name: "Garlic", quantity: 2, unit: "cloves" },
            { ingredientId: 708, name: "Cinnamon", quantity: 1, unit: "tsp" },
            { ingredientId: 505, name: "Cream", quantity: 200, unit: "ml" },
            { ingredientId: 503, name: "Eggs", quantity: 1, unit: "pcs" },
            { ingredientId: 504, name: "Cheese", quantity: 50, unit: "g" }
        ],
        privacy: false
    },
    {
        recipeId: 9,
        title: "Tacos al Pastor",
        description: "Mexican marinated pork tacos with pineapple and cilantro",
        prepTime: 20,
        cookTime: 25,
        difficulty: 2,
        cuisineType: "Mexican",
        flavor: "Spicy",
        isVegetarian:false,
        isGlutenFree:false,
        isLactoseFree:true,
        servings: 4,
        tags: ["street food", "tacos"],
        image: "https://imgs.search.brave.com/JEzxaxeDVRAPmprcudrA5HTir_UtjNN6fTkanoXYKL8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bXV5ZGVsaXNoLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/My8wNS9yZWNpcGUt/YWwtcGFzdG9yLXRh/Y29zLmpwZw",
        instructions: [
            "Marinate pork with achiote, pineapple juice, and spices.",
            "Grill the pork until fully cooked.",
            "Slice pork and serve on warm tortillas with pineapple and cilantro."
        ],
        ingredients: [
            { ingredientId: 115, name: "Pork Belly", quantity: 400, unit: "g" },
            { ingredientId: 309, name: "Pineapple", quantity: 100, unit: "g" },
            { ingredientId: 802, name: "Cilantro", quantity: 10, unit: "g" },
            { ingredientId: 202, name: "Onion", quantity: 1, unit: "pcs" },
            { ingredientId: 614, name: "Tortilla", quantity: 8, unit: "pcs" },
            { ingredientId: 306, name: "Lime", quantity: 1, unit: "pcs" }
        ],
        privacy: false
    },
    {
        recipeId: 10,
        title: "Sushi Rolls",
        description: "Japanese rice rolls with fresh fish and vegetables",
        prepTime: 40,
        cookTime: 0,
        difficulty: 3,
        cuisineType: "Japanese",
        flavor: "Mild",
        isVegetarian:false,
        isGlutenFree:true,
        isLactoseFree:true,
        servings: 4,
        tags: ["sushi", "healthy"],
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
        instructions: [
            "Cook sushi rice and season with vinegar, sugar, and salt.",
            "Lay nori on a bamboo mat, spread rice, and add fillings.",
            "Roll tightly, slice, and serve with soy sauce and wasabi."
        ],
        ingredients: [
            { ingredientId: 621, name: "Sushi Rice", quantity: 300, unit: "g" },
            { ingredientId: 425, name: "Salmon", quantity: 150, unit: "g" },
            { ingredientId: 207, name: "Cucumber", quantity: 1, unit: "pcs" },
            { ingredientId: 226, name: "Avocado", quantity: 1, unit: "pcs" },
            { ingredientId: 703, name: "Soy Sauce", quantity: 30, unit: "ml" },
            { ingredientId: 903, name: "Nori", quantity: 4, unit: "sheets" }
        ],
        privacy: false
    },
    {
        recipeId: 11,
        title: "Hummus and Falafel Plate",
        description: "Middle Eastern chickpea spread and fried chickpea balls",
        prepTime: 30,
        cookTime: 20,
        difficulty: 2,
        cuisineType: "Middle Eastern",
        flavor: "Savory",
        isVegetarian:true,
        isGlutenFree:true,
        isLactoseFree:true,
        servings: 4,
        tags: ["vegetarian", "appetizer"],
        image: "https://imgs.search.brave.com/wJh-6srCIKXyk4VnkCQWZejJx1V1jrJZn52HR9A1dJQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9teXB1/cmVwbGFudHMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIy/LzA5L0ZhbGFmZWwt/cGxhdHRlci03Lmpw/Zw",
        instructions: [
            "Blend chickpeas, tahini, lemon, garlic, and olive oil for hummus.",
            "Mix chickpeas, herbs, and spices, form into balls, and deep fry for falafel.",
            "Serve with pita bread and fresh vegetables."
        ],
        ingredients: [
            { ingredientId: 221, name: "Chickpeas", quantity: 300, unit: "g" },
            { ingredientId: 728, name: "Tahini", quantity: 50, unit: "g" },
            { ingredientId: 302, name: "Lemon", quantity: 1, unit: "pcs" },
            { ingredientId: 205, name: "Garlic", quantity: 2, unit: "cloves" },
            { ingredientId: 801, name: "Parsley", quantity: 10, unit: "g" },
            { ingredientId: 614, name: "Pita Bread", quantity: 4, unit: "pcs" },
            { ingredientId: 207, name: "Cucumber", quantity: 1, unit: "pcs" }
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

async function seed() {
    await connectDB();

    try {
        console.log("- Deleting old data -");
        await IngredientModel.deleteMany();
        await RecipeModel.deleteMany();
        // await RetailCompanyModel.deleteMany();
        // await UserModel.deleteMany();

        console.log("- Inserting ingredients -");
        await IngredientModel.insertMany(ingredientsData);

        console.log("- Processing recipes with categories -");
        const enrichedRecipes = recipesData.map(recipe => {
            return {
                ...recipe,
                ingredients: recipe.ingredients.map(ing => {
                    const reference = ingredientsData.find(i => i.ingredientId === ing.ingredientId);
                    return {
                        ...ing,
                        category: reference ? reference.category : IngredientCategory.OTHER
                    };
                })
            };
        });

        console.log("- Inserting enriched Recipes -");
        await RecipeModel.insertMany(enrichedRecipes, {
            ordered: false
        });

        // console.log("Inserting RetailCompanies");
        // await RetailCompanyModel.insertMany(retailData);

        console.log("Seed upload successful!");
        process.exit();

        } catch (err) {
            console.error("Seed error:", err);
            if (err.writeErrors) {
                err.writeErrors.forEach(e =>
                console.error(e.errmsg)
                );
            }
            process.exit();
    }   
}

seed();