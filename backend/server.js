require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const topBooksRoutes = require('./routes/topBooksRoutes');

// Initialisation de l'application Express
const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques du dossier "uploads"
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/books', require('./routes/bookRoutes'));

// Route test
app.get('/', (req, res) => {
  res.send('Serveur backend opérationnel !');
});

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/top-books', topBooksRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
