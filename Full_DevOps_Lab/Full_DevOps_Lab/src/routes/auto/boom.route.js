import { Router } from "express";

const router = Router();

/**
 * /boom → GET  (error simulation)
 */

router.get("/boom", (_req, _res, next) => {
  const err = new Error("Boom!");
  err.status = 500;
  next(err);
});

export default router;