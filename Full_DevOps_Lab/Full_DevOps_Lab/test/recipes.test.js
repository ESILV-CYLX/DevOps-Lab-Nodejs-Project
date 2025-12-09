import request from 'supertest';
import app from '../src/app.js';
import { recipes } from '../src/routes/auto/recipes.route.js';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

//TODO be careful before running tests: DELETES THE WHOLE RECIPES ARRAY !!!!!
beforeEach(() => {
    recipes.length = 0;

    recipes.push(
    {
        recipeId: 1,
        title: "Cheeseburger",
        description: "Yummyyy",
        prepTime: "15 min",
        cookTime: "30 min",
        difficulty: 2,
        cuisineType: "Meal",
        servings: 2,
        tags: ["fastfood", "meat", "lactose", "cheese", "burger"],
        instructions: ["Cut vegetables", "Cook meat and add cheese so it melts", "Assemble burger"],
        privacy: false
    });
});
describe("Recipes API", () => {

    // Test GET /recipes - returns all of the recipes
    it("GET /recipes should return an array", async () => {
        const res = await request(app).get("/recipes");
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test GET /recipes/:recipeId - returns a specific recipe
    it("GET /recipes/:recipeId should return a recipe", async () => {
        const res = await request(app).get("/recipes/1");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("title", "Cheeseburger");
    });

    // Test GET /recipes/:recipeId - recipe not found
    it("GET /recipes/:recipeId should return 404 when recipe not found", async () => {
        const res = await request(app).get("/recipes/999");

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    // Test POST /recipes - creates a new recipe
    it("POST /recipes should add a new recipe", async () => {
        const res = await request(app)
        .post("/recipes")
        .send({
            recipeId: 1,
            title: "Chocolate Cake",
            description: "Delicious and moist chocolate cake",
            prepTime: "20 min",
            cookTime: "30 min",
            difficulty: 2,
            cuisineType: "Dessert",
            servings: 4,
            tags: ["sweet", "cake"],
            instructions: ["Mix ingredients", "Bake for 30 minutes"],
            privacy: false
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("title", "Chocolate Cake");
        expect(res.body).toHaveProperty("description", "Delicious and moist chocolate cake");
    });

    // Test POST /recipes - error because of missing values
    it("POST /recipes should fail with missing values", async () => {
        const res = await request(app)
        .post("/recipes")
        .send({ recipeId: 2 });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    // Test PUT /recipes/:id - update of an existing recipe
    it("PUT /recipes/:id should update an existing recipe", async () => {
        const res = await request(app)
            .put("/recipes/1")
            .send({
                title: "Chocolate Cake Updated",
                description: "Even more delicious",
                prepTime: "25 min",
                cookTime: "35 min",
                difficulty: 3,
                cuisineType: "Dessert",
                servings: 6,
                tags: ["sweet", "cake", "updated"],
                instructions: ["Mix better ingredients", "Bake longer"],
                privacy: false
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("title", "Chocolate Cake Updated");
        expect(res.body.servings).toBe(6);
    });

    // Test PUT /recipes/:id - error because recipe does not exist
    it("PUT /recipes/:id should return 404 if recipe not found", async () => {
        const res = await request(app)
        .put("/recipes/999")
        .send({ title: "Test" });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    // Test DELETE /recipes/:id
    it("DELETE /recipes/:id should remove a recipe", async () => {
        const res = await request(app).delete("/recipes/1");
        expect(res.status).toBe(204);

        const getRes = await request(app).get("/recipes");
        expect(getRes.body.find(r => r.recipeId === 1)).toBeUndefined();
    });

    // Test DELETE /recipes/:id - error because recipe does not exist
    it("DELETE /recipes/:id should return 404 if recipe not found", async () => {
        const res = await request(app).delete("/recipes/999");
        
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
});