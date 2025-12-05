// /auth/signup, /auth/login, /auth/logout (GET, POST, PUT, DELETE)
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'module-alias/register.js';

import User from '../../models/User.js';

const router = express.Router();
let users = [];
const SALT_ROUNDS = 10;
const JWT_SECRET = "secret_key_example";

// POST /auth/signup
router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) return res.status(400).json({ error: 'Missing username, password or email' });
    if(users.find(u => u.username === username)) return res.status(409).json({ error: 'Username already exists' });
    if(users.find(u => u.email === email)) return res.status(409).json({ error: 'Account with this mail already exists' });

    if (password.length < 6) return res.status(400).json({ error: 'Password too short (min 6 chars)' });
  
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const newUser = new User(users.length + 1, username, email, hashedPassword, [], 1);
    users.push(newUser);
    res.status(201).json({message: 'Signup successful, try login with the new account!'});
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '1h' });

    const { password: _, ...userSafe } = user;
    res.json({ message: 'Login successful', token, user: userSafe });
});

// GET /auth/logout
router.get('/logout', (req, res) => {
    //TODO implement token invalidation or session destruction
    res.json({ message: 'Logout successful' });
});



export { users }; // for testing purposes
export default router;