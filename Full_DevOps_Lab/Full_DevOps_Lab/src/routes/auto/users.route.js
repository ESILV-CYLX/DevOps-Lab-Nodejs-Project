import express from "express";
import { User } from "./User.js";  

const router = express.Router();
let users = [];

const JWT_SECRET = "secret_key_example"; //TODO move to env variable but npm install dotenv doesn't work

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = payload.userId;
    next();
  });
}

// GET /users - Only public data
router.get("/", (req, res) => {
    const usersSafe = users.map(({ password, ...u }) => u);
    res.json(usersSafe);
});

// GET /users/:id
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.userId === id);

    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, ...userSafe } = user;
    res.json(userSafe);
});

// PUT /users/:id - modification only on your OWN data
router.put("/:id", authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);

    if (req.userId !== id) return res.status(403).json({ error: "Forbidden: cannot update another user" });
  
    const index = users.findIndex(u => u.userId === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });
        

    const updatedUserData = req.body;
    const updatedUser = new User(
        id,
        updatedUserData.username,
        updatedUserData.email,
        users[index].password,
        updatedUserData.dietaryPreferences || users[index].dietaryPreference,
        updatedUserData.servingSize || users[index].servingSize
    );
    users[index] = updatedUser;

    const { password, ...userSafe } = updatedUser;
    res.json(userSafe);
});

// PUT /users/:id/password - change password only on your OWN account
router.put("/:id/password", authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    if (req.userId !== id) return res.status(403).json({ error: "Forbidden: cannot change password for another user" });

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: "Missing old or new password" });
    
    const index = users.findIndex(u => u.userId === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });

    const user = users[index];
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ error: "Old password is incorrect" });

    if (newPassword.length < 6) return res.status(400).json({ error: "New password too short (min 6 chars)" });

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS); 
    user.password = hashedPassword;

    res.json({ message: "Password updated successfully" });
});

export { users }; //for testing purposes
export default router;