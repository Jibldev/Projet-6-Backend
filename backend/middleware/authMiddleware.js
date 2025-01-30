const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    console.log("🔹 Middleware d'authentification appelé"); // Doit s'afficher

    try {
        console.log("Headers reçus :", req.headers);

        const authHeader = req.headers.authorization;
        console.log("Authorization Header :", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("⛔ Token manquant ou mal formé !");
            return res.status(401).json({ message: "Token manquant ou mal formé" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token extrait :", token);

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token décodé :", decodedToken);

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("🚨 Erreur d'authentification :", error);
        res.status(401).json({ message: "Authentification invalide" });
    }
};
