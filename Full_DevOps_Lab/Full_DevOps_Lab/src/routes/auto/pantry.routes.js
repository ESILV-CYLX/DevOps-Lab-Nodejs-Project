import express from "express";
import {
    getPantryController,
    addPantryController,
    deletePantryController
} from "../../controllers/pantry.controller.js";

const router = express.Router();

router.get("/", getPantryController);
router.post("/", addPantryController);
router.delete("/", deletePantryController);

export default router;
