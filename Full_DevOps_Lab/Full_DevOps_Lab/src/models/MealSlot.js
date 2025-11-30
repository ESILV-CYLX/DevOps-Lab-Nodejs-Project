export class MealSlot{
    /**
     * @param {number} mealSlotId
     * @param {string} mealType
     * @param {string} day
     * @param {number} recipeId
     * @param {number} servings
     */
    constructor(mealSlotId, mealType, day, recipeId, servings){
        this.mealSlotId = mealSlotId;
        this.mealType = mealType;
        this.day = day;
        this.recipeId = recipeId;
        this.servings = servings;
    }
}