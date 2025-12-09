import { Router } from "express";
import { getVersion } from "../../controllers/version.controller.js";

const router = Router();

/**
 * /version → GET   (application version)
 */
router.get("/version", getVersion);

export default router;