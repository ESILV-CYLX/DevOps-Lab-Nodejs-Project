import jwt from "jsonwebtoken";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;


export default function authenticateToken(req, res, next) {
    const header = req.headers.authorization;
    const token = header && header.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret, (err, payload) => {
        if (err) {
            console.error("JWT Error:", err.message); // Pour debug en console
            return res.status(403).json({ error: "Invalid token" });
        }
        req.userId = payload.userId;
        next();
    });
}