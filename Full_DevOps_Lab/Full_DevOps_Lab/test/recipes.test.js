import request from 'supertest';
import app from '../src/app.js';

describe("Recipes API", () => {

  // Test GET /recipes - devrait retourner un tableau
  it("GET /recipes should return an array", async () => {
    const res = await request(app).get("/recipes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test POST /recipes - création d'une recette
  it("POST /recipes should add a new recipe", async () => {
    const newRecipe = {
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
    };

    const res = await request(app)
      .post("/recipes")
      .send(newRecipe);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "Chocolate Cake");
    expect(res.body).toHaveProperty("description", "Delicious and moist chocolate cake");
  });

  // Test POST /recipes avec données manquantes
  it("POST /recipes should fail with missing title or description", async () => {
    const res = await request(app)
      .post("/recipes")
      .send({ recipeId: 2 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // Test PUT /recipes/:id - mise à jour
  it("PUT /recipes/:id should update an existing recipe", async () => {
    const updatedRecipe = {
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
    };

    const res = await request(app)
      .put("/recipes/1")
      .send(updatedRecipe);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Chocolate Cake Updated");
  });

  // Test PUT /recipes/:id - recette inexistante
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

    // Vérifie que la recette n'existe plus
    const getRes = await request(app).get("/recipes");
    expect(getRes.body.find(r => r.recipeId === 1)).toBeUndefined();
  });

  // Test DELETE /recipes/:id - recette inexistante
  it("DELETE /recipes/:id should return 404 if recipe not found", async () => {
    const res = await request(app).delete("/recipes/999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});