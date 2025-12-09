import { Router } from "express";
import { getInfo } from "../controllers/info.controller.js";

const router = Router();

/**
 * /info  → GET    (application information)
 */
router.get("/info", getInfo);

export default router;