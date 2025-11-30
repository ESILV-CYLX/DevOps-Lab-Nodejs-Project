import express from "express";
import { User } from "./User.js";  

const router = express.Router();
let users = [];

// GET /users
router.get("/", (req, res) => {
    res.json(users);
});

// GET /users/:id
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.userId === id);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
});

// PUT /users/:id
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.userId === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });
        

    const updatedUserData = req.body;
    const updatedUser = new User(
        id,
        updatedUserData.username,
        updatedUserData.email,
        updatedUserData.password,
        updatedUserData.dietaryPreferences,
        updatedUserData.servingSize
    );
    users[index] = updatedUser;
    res.json(updatedUser);
});

// POST /users
router.post("/", (req, res) => {
    const { userId, username, email, password, dietaryPreferences, servingSize } = req.body;
    if (!userId || !username || !email || !password || !servingSize) return res.status(400).json({ error: 'Missing elements to create a new user' });
    
    const newUser = new User(userId, username, email, password, dietaryPreferences, servingSize);
    users.push(newUser);
    res.status(201).json(newUser);
});

export { users }; //for testing purposes
export default router;