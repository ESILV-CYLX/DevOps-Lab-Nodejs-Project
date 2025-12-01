import request from 'supertest';
import app from '../src/app.js';
import { users } from '../src/routes/auto/users.route.js';

//TODO be careful before running tests: DELETES THE WHOLE USERS ARRAY !!!!!
beforeEach(() => {
    users.length = 0;

    users.push(
    {
        userId: 1,
        username: "alice",
        email: "alice@example.com",
        password: "pass123",
        dietaryPreferences: ["vegan"],
        servingSize: 2
    });
});

describe("Users API", () => {

    // Test GET /users - returns all of the users
    it("GET /users should return an array", async () => {
        const res = await request(app).get("/users");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test GET /users/:id - returns a specific user
    it("GET /users/:id should return a user", async () => {
        const res = await request(app).get("/users/1");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("username", "alice");
    });

    // Test GET /users/:id - user not found
    it("GET /users/:id should return 404 when user not found", async () => {
        const res = await request(app).get("/users/999");

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
  
    // Test POST /users - creates a new user
    it("POST /users should create a new user", async () => {
        const res = await request(app)
        .post("/users")
        .send({
            userId: 2,
            username: "bob",
            email: "bob@example.com",
            password: "12345",
            dietaryPreferences: ["gluten-free"],
            servingSize: 4
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("username", "bob");
        expect(users.length).toBe(2);
    });


    // Test POST /users - error because of missing values
    it("POST /users should fail with missing values", async () => {
        const res = await request(app)
        .post("/users")
        .send({
            userId: 3,
            email: "test@example.com"
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    // Test PUT /users/:id - update of an existing user
    it("PUT /users/:id should update an existing user", async () => {
        const res = await request(app)
            .put("/users/1")
            .send({
                username: "aliceUpdated",
                email: "alice@new.com",
                password: "newpass",
                dietaryPreferences: ["vegan", "bio"],
                servingSize: 3
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("username", "aliceUpdated");
        expect(res.body.servingSize).toBe(3);
    });

    // Test PUT /users/:id - error because user does not exist
    it("PUT /users/:id should return 404 when user does not exist", async () => {
        const res = await request(app)
        .put("/users/123")
        .send({
            username: "ghost",
            email: "ghost@example.com",
            password: "ghostpass"
        });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
});