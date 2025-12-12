// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connexion à TA base de données MongoDB
// J'ai pris l'URI exacte que tu m'as donnée
const MONGO_URI = "mongodb+srv://okinaru:HID0kSrRESYwArZL@software-eng.qulphpl.mongodb.net/MealPlannerDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB avec succès !"))
  .catch(err => console.error("❌ Erreur de connexion Mongo :", err));

// 2. Définition du modèle "Utilisateur" (À quoi ressemble une ligne dans la table)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Note: En prod, on crypte toujours le mot de passe !
});

const User = mongoose.model('User', UserSchema);

// 3. La route pour s'inscrire (Signup)
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà !" });
    }

    // Créer le nouvel utilisateur
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
});

// 4. La route pour se connecter (Login - simple vérification)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // On cherche l'utilisateur
    const user = await User.findOne({ username, password });
    
    if (user) {
        res.json({ message: "Connexion réussie", username: user.username });
    } else {
        res.status(401).json({ message: "Identifiants incorrects" });
    }
});

// Lancer le serveur sur le port 3000
app.listen(3000, () => {
  console.log("🚀 Serveur Backend lancé sur http://localhost:3000");
});