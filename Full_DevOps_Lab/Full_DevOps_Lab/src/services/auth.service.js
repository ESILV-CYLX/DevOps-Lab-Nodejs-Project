import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export const signup = async ({ username, password, email }) => {
    // 1. Validation basique
    if (!username || !password || !email)
        throw { status: 400, message: "Missing username, password or email" };

    if (password.length < 6)
        throw { status: 400, message: "Password too short (min 6 chars)" };

    // 2. Vérifier dans MONGODB si l'utilisateur existe déjà
    // On utilise $or pour vérifier si le pseudo OU l'email est pris
    const existingUser = await User.findOne({ 
        $or: [{ username: username }, { email: email }] 
    });

    if (existingUser) {
        throw { status: 409, message: "Username or Email already exists" };
    }

    // 3. Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 4. Création du nouvel utilisateur (Syntaxe Mongoose Correcte)
    // Note: Pour userId, on utilise un timestamp pour avoir un nombre unique rapidement
    // Idéalement, on laisserait Mongo gérer l'_id, mais ton schéma impose un userId nombre.
    const newUser = new User({
        userId: Date.now(), 
        username, 
        email, 
        password: hashedPassword, 
        dietaryPreferences: [], 
        servingSize: 1
    });

    // 5. Sauvegarde réelle dans la BDD
    await newUser.save();

    return { message: "Signup successful, try login with the new account!" };
};

export const login = async ({ username, password }) => {
    // 1. Chercher l'utilisateur dans MONGODB
    const user = await User.findOne({ username });
    
    if (!user) throw { status: 401, message: "Invalid credentials" };

    // 2. Vérifier le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw { status: 401, message: "Invalid credentials" };

    // 3. Générer le Token
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: "1h" });

    // 4. Renvoyer les infos (sans le mot de passe)
    // On utilise toObject() pour avoir un objet propre JS sans les trucs internes Mongoose
    const userSafe = user.toObject();
    delete userSafe.password;

    return { message: "Login successful", token, user: userSafe };
};