import request from "supertest";
import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../../src/app.js";
import Pantry from "../../src/models/Pantry.js";

describe("Pantry API (integration)", () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Pantry.deleteMany({});
    });

    it("creates a pantry item and returns it in the list", async () => {

        const createRes = await request(app)
            .post("/pantry")
            .send({ nid: 10, nquantity: 3 });

        expect(createRes.status).toBe(201);
        expect(createRes.body).toHaveProperty("id", 10);
        expect(createRes.body).toHaveProperty("quantity", 3);

        const listRes = await request(app).get("/pantry");

        expect(listRes.status).toBe(200);
        expect(Array.isArray(listRes.body)).toBe(true);
        expect(listRes.body.length).toBe(1);
        expect(listRes.body[0].id).toBe(10);
        expect(listRes.body[0].quantity).toBe(3);
    });

    it("deletes a pantry item", async () => {
        await request(app)
            .post("/pantry")
            .send({ nid: 5, nquantity: 2 });

        const deleteRes = await request(app)
            .delete("/pantry")
            .send({ nid: 5 });

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toBe("Ingrédient supprimé");

        const listRes = await request(app).get("/pantry");

        expect(listRes.status).toBe(200);
        expect(listRes.body.length).toBe(0);
    });
});
