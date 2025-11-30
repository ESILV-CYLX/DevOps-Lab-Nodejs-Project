import request from 'supertest';
import app from '../src/app.js';
import { users } from '../src/routes/auto/auth.route.js';

beforeEach(() => {
    users.length = 0;
});

describe("Auth API", () => {

    // POST /auth/signup - creates a new user
    it("POST /auth/signup should create a new user", async () => {
        const res = await request(app)
        .post("/auth/signup")
        .send({
            username: "alice",
            email: "alice@example.com",
            password: "password123"
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Signup successful, try login with the new account!");
        expect(users.length).toBe(1);
    });

    // POST /auth/signup - error because username already exists in users array
    it("POST /auth/signup should fail if username already exists", async () => {
        users.push({ username: "alice", email: "alice@example.com", password: "hashed" });

        const res = await request(app)
        .post("/auth/signup")
        .send({
            username: "alice",
            email: "alice2@example.com",
            password: "password123"
        });

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("error", "Username already exists");
    });

    // POST /auth/signup - error because email already exists in users array
    it("POST /auth/signup should fail if email already exists", async () => {
        users.push({ username: "bob", email: "bob@example.com", password: "hashed" });

        const res = await request(app)
        .post("/auth/signup")
        .send({
            username: "test",
            email: "bob@example.com",
            password: "password123"
        });

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("error", "Account with this mail already exists");
    });

    // POST /auth/signup - error because password is too short
    it("POST /auth/signup should fail if password too short", async () => {
        const res = await request(app)
        .post("/auth/signup")
        .send({
            username: "test_bis",
            email: "test@example.com",
            password: "123"
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Password too short (min 6 chars)");
    });

    // POST /auth/login - login successful
    it("POST /auth/login should succeed with correct credentials", async () => {
        const bcrypt = await import('bcrypt');
        const hashed = await bcrypt.hash("password123", 10);
        users.push({ userId: users.length + 1, username: "robin", email: "robin@example.com", password: hashed });

        const res = await request(app)
        .post("/auth/login")
        .send({
            username: "robin",
            password: "password123"
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Login successful");
        expect(res.body).toHaveProperty("token");
        expect(res.body.user).toHaveProperty("username", "alice");
        expect(res.body.user).not.toHaveProperty("password");
    });

    // POST /auth/login - error because wrong password
    it("POST /auth/login should fail with wrong password", async () => {
        const bcrypt = await import('bcrypt');
        const hashed = await bcrypt.hash("password123", 10);
        users.push({ userId: users.length + 1, username: "batman", email: "batman@example.com", password: hashed });

        const res = await request(app)
        .post("/auth/login")
        .send({
            username: "batman",
            password: "wrongpass"
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error", "Invalid credentials");
    });

    // POST /auth/login - error because user doesn't exist
    it("POST /auth/login should fail if user does not exist", async () => {
        const res = await request(app)
        .post("/auth/login")
        .send({
            username: "ghost",
            password: "password123"
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error", "Invalid credentials");
    });

    // GET /auth/logout - logout successful
    it("GET /auth/logout should return logout message", async () => {
        const res = await request(app).get("/auth/logout");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Logout successful");
    });
});