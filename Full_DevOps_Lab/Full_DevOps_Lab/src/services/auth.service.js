import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET;

// stockage temporaire (à remplacer plus tard par DB)
let users = [];

export const signup = async ({ username, password, email }) => {
    if (!username || !password || !email)
        throw { status: 400, message: "Missing username, password or email" };

    if (users.find(u => u.username === username))
        throw { status: 409, message: "Username already exists" };

    if (users.find(u => u.email === email))
        throw { status: 409, message: "Account with this mail already exists" };

    if (password.length < 6)
        throw { status: 400, message: "Password too short (min 6 chars)" };

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    //TODO check the other parameters implementation
    const newUser = new User(users.length + 1, username, email, hashedPassword, [], 1);
    users.push(newUser);
    return { message: "Signup successful, try login with the new account!" };
};

export const login = async ({ username, password }) => {
    const user = users.find(u => u.username === username);
    if (!user) throw { status: 401, message: "Invalid credentials" };

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw { status: 401, message: "Invalid credentials" };

    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: "1h" });

    const { password: _, ...userSafe } = user;
    return { message: "Login successful", token, user: userSafe };
};

export { users }; // pour test si besoin