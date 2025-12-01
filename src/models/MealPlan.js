import { MealSlot } from "./MealSlot";

export class MealPlan {
    /**
     * @param {number} mealPlanId
     * @param {number} userId
     * @param {Date} weekStartDate
     * @param {Date} weekEndDate
     * @param {boolean} state
     * @param {boolean} privacy
     * @param {Recipe[]} recipes
     * @param {MealSlot[]} mealSlots
     */
    constructor(mealPlanId, userId, weekStartDate, weekEndDate, state, privacy){
        this.mealPlanId = mealPlanId;
        this.userId = userId;
        this.weekStartDate = weekStartDate;
        this.weekEndDate = weekEndDate;
        this.state = state;
        this.privacy = privacy;
        this.recipes = [];
        this.mealSlots = [];
    }
    
    addRecipe(recipe) {}
    removeRecipe(recipeId) {}
    addMealSlot(slot) {}
    removeMealSlot(slotId) {}
}