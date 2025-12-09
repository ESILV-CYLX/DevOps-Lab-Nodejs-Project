import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { users } from '../src/routes/auto/users.route.js';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

const JWT_SECRET = "secret_key_example"; //TODO remove once env works...

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

// Generates token for a specific user 'userId'
function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET);
}

describe("Users API", () => {

    // Test GET /users - returns all of the users
    it("GET /users should return an array WITHOUT passwords", async () => {
        const token = generateToken(1);
        const res = await request(app).get("/users").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).not.toHaveProperty("password");
    });

    // Test GET /users/:id - returns a specific user
    it("GET /users/:id should return a user WITHOUT password", async () => {
        const token = generateToken(1);
        const res = await request(app).get("/users/1").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("username", "alice");
        expect(res.body).not.toHaveProperty("password");
    });

    // Test GET /users/:id - user not found
    it("GET /users/:id should return 404 when user not found", async () => {
        const token = generateToken(999);
        const res = await request(app).get("/users/999").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    // Test PUT /users/:id - update of an existing user
    it("PUT /users/:id should update an existing user", async () => {
        const token = generateToken(1);
        const res = await request(app)
            .put("/users/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "aliceUpdated",
                email: "alice@new.com",
                dietaryPreferences: ["vegan", "bio"],
                servingSize: 3
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("username", "aliceUpdated");
        expect(res.body.servingSize).toBe(3);
        expect(res.body).not.toHaveProperty("password");
    });

    // Test PUT /users/:id - error because trying to update another user
    it("PUT /users/:id should return 403 if updating another user", async () => {
        const token = generateToken(1);

        const res = await request(app)
        .put("/users/2")
        .set("Authorization", `Bearer ${token}`)
        .send({
            username: "bob"
        });

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");
    });
    
    // Test PUT /users/:id - error because user does not exist
    it("PUT /users/:id should return 404 when user does not exist", async () => {
        const token = generateToken(999);

        const res = await request(app)
        .put("/users/999")
        .set("Authorization", `Bearer ${token}`)
        .send({
            username: "ghost",
            email: "ghost@example.com",
        });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    // Test PUT /users/:id/password - change password successfully
    it("PUT /users/:id/password should update password successfully", async () => {
        const token = generateToken(1);

        const res = await request(app)
        .put("/users/1/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            oldPassword: "pass123",
            newPassword: "newpass456"
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Password updated successfully");

        const user = users.find(u => u.userId === 1);
        const match = await bcrypt.compare("newpass456", user.password);
        expect(match).toBe(true);
    });

    // Test PUT /users/:id/password - error because old password is incorrect
    it("PUT /users/:id/password should fail with wrong old password", async () => {
        const token = generateToken(1);

        const res = await request(app)
        .put("/users/1/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            oldPassword: "wrongpass",
            newPassword: "newpass456"
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error", "Old password is incorrect");
    });

    // Test PUT /users/:id/password - error because new password is too short
    it("PUT /users/:id/password should fail if new password is too short", async () => {
        const token = generateToken(1);

        const res = await request(app)
        .put("/users/1/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            oldPassword: "pass123",
            newPassword: "123"
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "New password too short (min 6 chars)");
    });

    // Test PUT /users/:id/password - error because trying to update another user's password
    it("PUT /users/:id/password should fail if updating another user's password", async () => {
        const token = generateToken(1);

        const res = await request(app)
        .put("/users/2/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            oldPassword: "pass123",
            newPassword: "newpass456"
        });

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");
    });

    // Test PUT /users/:id/password - error because user does not exist
    it("PUT /users/:id/password should fail if user does not exist", async () => {
        const token = generateToken(999);

        const res = await request(app)
        .put("/users/999/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
            oldPassword: "whatever",
            newPassword: "newpass456"
        });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
});