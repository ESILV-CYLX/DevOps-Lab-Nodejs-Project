import * as plannerService from "../services/planner.service.js";

// GET /planner/
export async function getMealPlans(req, res) {
    try {
        const mealPlans = await plannerService.getMealPlans(req.userId);
        res.json(mealPlans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /planner
export async function createMealPlan(req, res) {
    try {
        const mealPlanData = req.body;
        const newMealPlan = await plannerService.createMealPlan(req.userId, mealPlanData);
        res.status(201).json(newMealPlan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// PUT /planner/:id
export async function updateMealPlan(req, res) {
    try {
        const mealPlanId = req.params.id;
        const updateData = req.body;
        const updatedMealPlan = await plannerService.updateMealPlan(req.userId, mealPlanId, updateData);
        res.json(updatedMealPlan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// DELETE /planner/:id
export async function deleteMealPlan(req, res) {
    try {
        const mealPlanId = req.params.id;
        const result = await plannerService.deleteMealPlan(req.userId, mealPlanId);
        res.json(result);
    } catch (err) {
        const status = err.message.includes("not found") ? 404 : 500;
        res.status(status).json({ error: err.message });
    }
}