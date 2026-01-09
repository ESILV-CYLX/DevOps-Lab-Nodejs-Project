import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export const signup = async ({ username, password, email }) => {
    if (!username || !password || !email) throw { status: 400, message: "Missing username, password or email" };
    if (password.length < 6) throw { status: 400, message: "Password too short (min 6 chars)" };

    const existingUser = await User.findOne({ 
        $or: [{ username: username }, { email: email }] //check si l'email est déjà utilisé
    });

    if (existingUser) throw { status: 409, message: "Username or Email already exists" };

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({
        userId: Date.now(), 
        username, 
        email, 
        password: hashedPassword, 
        dietaryPreferences: [], 
        servingSize: 1
    });

    await newUser.save();
    return { message: "Signup successful, try login with the new account!" };
};

export const login = async ({ username, password }) => {
    const user = await User.findOne({ username });
    
    if (!user) throw { status: 401, message: "Invalid credentials" };

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw { status: 401, message: "Invalid credentials" };

    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: "1h" });
    const userSafe = user.toObject();
    delete userSafe.password;

    return { message: "Login successful", token, user: userSafe };
};