import request from "supertest";
import express from "express";
import plannerRouter from "../routes/auto/planner.route.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use("/planner", plannerRouter);

// Token JWT pour tests
const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || "testsecret");

describe("Planner API", () => {
    it("GET /planner -> should return 200", async () => {
        const res = await request(app)
            .get("/planner")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("POST /planner -> should create a meal plan", async () => {
        const res = await request(app)
            .post("/planner")
            .set("Authorization", `Bearer ${token}`)
            .send({
                weekStartDate: "2025-12-09",
                weekEndDate: "2025-12-15",
                recipes: [],
                mealSlots: [],
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("mealPlanId");
    });

    it("PUT /planner/:id -> should update a meal plan", async () => {
        const res = await request(app)
            .put("/planner/1")
            .set("Authorization", `Bearer ${token}`)
            .send({ privacy: true });
        expect(res.statusCode).toBe(200);
        expect(res.body.privacy).toBe(true);
    });
});