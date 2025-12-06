import jwt from "jsonwebtoken";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET;

export default function authenticateToken(req, res, next) {
    const header = req.headers.authorization;
    const token = header && header.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.userId = payload.userId;
        next();
    });
}