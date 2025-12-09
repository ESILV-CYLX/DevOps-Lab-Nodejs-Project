import MealPlanModel from "../models/MealPlan.js";

//get all the mean plan of a user
export async function getMealPlans(userId) {
    return MealPlanModel.find({ userId }).exec();
}

// Creates a new mealplan
export async function createMealPlan(userId, mealPlanData) {
    const lastMealPlan = await MealPlanModel.findOne().sort({ mealPlanId: -1 }).exec();
    const newMealPlanId = lastMealPlan ? lastMealPlan.mealPlanId + 1 : 1;

    const newMealPlan = new MealPlanModel({
        mealPlanId: newMealPlanId,
        userId,
        weekStartDate: mealPlanData.weekStartDate,
        weekEndDate: mealPlanData.weekEndDate,
        recipes: mealPlanData.recipes || [],
        mealSlots: mealPlanData.mealSlots || [],
        state: mealPlanData.state ?? true,
        privacy: mealPlanData.privacy ?? false,
    });

    return newMealPlan.save();
}

// Updates an exisiting mealplan
export async function updateMealPlan(userId, mealPlanId, updateData) {
    const mealPlan = await MealPlanModel.findOne({ mealPlanId, userId });
    if (!mealPlan) throw new Error("MealPlan not found");

    Object.assign(mealPlan, updateData);
    return mealPlan.save();
}