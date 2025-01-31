const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// 📌 Inscription (Signup)
exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('🔍 Tentative d\'inscription avec :', email);

        // Vérifie si l'utilisateur existe déjà AVANT de vérifier les erreurs de validation
        let user = await User.findOne({ email });
        console.log('👤 Utilisateur existe déjà ?', user);

        if (user) {
            return res.status(400).json({ message: "Cet utilisateur existe déjà !" });
        }

        // Vérification des erreurs de validation après la vérification de l'utilisateur
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Erreur de validation complète :', errors.array());
            return res.status(400).json({ message: "Erreur de validation", details: errors.array() });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        user = new User({ email, password: hashedPassword });
        await user.save();

        console.log('✅ Utilisateur créé avec succès !');
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        console.error('🚨 Erreur serveur:', err.message);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};





const jwt = require("jsonwebtoken");

// 📌 Connexion (Login)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("connexion email", email);
        // Vérifie si l'utilisateur existe
        let user = await User.findOne({ email });
        console.log("utilisateur trouvé", user);
        if (!user) {
            console.log("Utilisateur Introuvable");
            return res.status(400).json({ message: "Utilisateur introuvable !" });
        }

        // Vérifie le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Mot de passe correct", isMatch);
        if (!isMatch) {
            console.log("Mot de passe incorrect !");
            return res.status(400).json({ message: "Mot de passe incorrect !" });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log("Connexion réussie");
        console.log("Connexion réussie");
        res.json({ token, userId: user._id });
    } catch (err) {
        console.log("Erreur serveur");
        console.log("Erreur serveur");
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
