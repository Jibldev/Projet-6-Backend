require("dotenv").config();
console.log("🔍 Chargement des variables d'environnement...");
console.log("🔍 URI MongoDB:", process.env.MONGO_URI);

const mongoose = require("mongoose");

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connecté !"))
.catch(err => console.error("❌ Erreur de connexion à MongoDB :", err));


const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route test
app.get("/", (req, res) => {
    res.send("Serveur backend opérationnel !");
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
