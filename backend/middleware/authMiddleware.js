const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token manquant ou mal formé" });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("🚨 Erreur d'authentification :", error);
        res.status(401).json({ message: "Authentification invalide" });
    }
};
