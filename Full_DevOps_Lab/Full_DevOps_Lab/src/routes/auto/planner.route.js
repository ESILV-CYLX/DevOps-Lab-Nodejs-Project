// planner (GET, POST, PUT)
import express from "express";
import { getMealPlans, createMealPlan, updateMealPlan} from "../../controllers/planner.controller.js";
import authenticateToken from "../../middleware/auth.middleware.js";

const router = express.Router();

/**
 * /        → GET    (gets the meal planners of a user)
 * /        → POST    (creates a meal planner for a user)
 * /:id     → PUT     (updates a meal planner for a user)
 */

router.use(authenticateToken);

router.get("/", getMealPlans);
router.post("/", updateMealPlan);
router.put("/:id", createMealPlan);

export default router;