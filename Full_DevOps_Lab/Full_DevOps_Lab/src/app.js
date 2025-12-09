import express from "express";
import { errorHandler } from "./utils/errorHandler.js";
import { connectToDb } from "./db/mongo.js";

// 1. IMPORTS MANUELS DES ROUTES (On arrête l'auto-mount qui bug)
// Attention aux chemins relatifs !
import authRouter from "./routes/auto/auth.route.js";
import usersRouter from "./routes/auto/users.route.js";
import recipesRouter from "./routes/auto/recipes.route.js";
import shoppingListRouter from "./routes/auto/shoppingList.route.js";
import plannerRouter from "./routes/auto/planner.route.js";
import pantryRouter from "./routes/auto/pantry.routes.js";
const app = express();

// 2. MIDDLEWARE JSON (Vital pour que les POST marchent)
app.use(express.json());

connectToDb();

// 3. BRANCHEMENT MANUEL DES ROUTES
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/recipes", recipesRouter);
app.use("/shopping-list", shoppingListRouter);
app.use("/planner", plannerRouter);
app.use("/pantry", pantryRouter);

// Routes de base
app.get("/", (_req, res) => res.json({ ok: true }));
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Pour le test de version qui échouait
app.get("/version", (_req, res) => res.json({ version: "1.0.0" }));

// Gestion des erreurs
app.use(errorHandler);

export default app;