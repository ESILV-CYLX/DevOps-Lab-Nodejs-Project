export class Recipe {
    /**
     * @param {number} recipeId
     * @param {string} title
     * @param {string} description
     * @param {string} prepTime
     * @param {string} cookTime
     * @param {number} difficulty
     * @param {string} cuisineType
     * @param {number} servings
     * @param {string[]} tags
     * @param {string[]} instructions
     * @param {string[]} ingredients
     * @param {boolean} privacy
     */
    constructor(recipeId, title, description, prepTime, cookTime, difficulty, cuisineType, servings, tags, instructions, privacy) {
        this.recipeId = recipeId;
        this.title = title;
        this.description = description;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.difficulty = difficulty;
        this.cuisineType = cuisineType;
        this.servings = servings;
        this.tags = tags;
        this.instructions = instructions;
        this.ingredients = [];
        this.privacy = privacy;
    }

    //TODO
    addIngredient(ingredient){}
    removeIngredient(ingredientId){}
    modifyServingSize(newSize){}

}