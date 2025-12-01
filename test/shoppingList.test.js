import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app'; // Vérifie que c'est bien ../src/app

describe("Shopping List API (with InMemory DB)", () => {
  let mongoServer;
  let testUserId = "user_test_mongo_" + Date.now(); // ID unique pour éviter les conflits
  let itemIdToDelete;

  // AVANT TOUT : On lance le mini-MongoDB
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // On connecte Mongoose à ce mini-serveur
    await mongoose.connect(uri);
  });

  // APRES TOUT : On éteint tout proprement
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Test 1 : Ajouter un item
  it("POST /shopping-list/item adds an item", async () => {
    const newItem = {
      userId: testUserId,
      item: { name: "Mangue", quantity: 2, unit: "pcs" }
    };

    const res = await request(app)
      .post("/shopping-list/item")
      .send(newItem);

    // Si ça plante ici, c'est souvent express.json() qui manque dans app.js
    expect(res.status).toBe(201);
    expect(res.body.items.length).toBeGreaterThan(0);
    
    // On sauvegarde l'ID généré par MongoDB pour les tests suivants
    // Attention: parfois l'ID est dans _id, parfois id
    const createdItem = res.body.items.find(i => i.name === "Mangue");
    itemIdToDelete = createdItem._id;
  });

  // Test 2 : Récupérer la liste
  it("GET /shopping-list returns the list", async () => {
    const res = await request(app).get(`/shopping-list?userId=${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  // Test 3 : Modifier l'item
  it("PUT /shopping-list/item/:id updates check status", async () => {
    const res = await request(app)
      .put(`/shopping-list/item/${itemIdToDelete}`)
      .send({ userId: testUserId, checked: true });

    expect(res.status).toBe(200);
    const updatedItem = res.body.items.find(i => i._id === itemIdToDelete);
    expect(updatedItem.checked).toBe(true);
  });

  // Test 4 : Supprimer l'item
  it("DELETE /shopping-list/item/:id removes item", async () => {
    const res = await request(app)
      .delete(`/shopping-list/item/${itemIdToDelete}`)
      .send({ userId: testUserId });

    expect(res.status).toBe(204);
  });
});