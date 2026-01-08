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
        weekStartDate: mealPlanData.weekStartDate || new Date(),
        weekEndDate: mealPlanData.weekEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        name: mealPlanData.name || "My MealPlan",
        content: mealPlanData.content,
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

// Deletes a saved mealplan
export async function deleteMealPlan(userId, id) {
    const result = await MealPlanModel.deleteOne({ _id: id, userId });
    
    if (result.deletedCount === 0) {
        throw new Error("MealPlan not found or unauthorized");
    }
    
    return { message: "MealPlan deleted successfully" };
}