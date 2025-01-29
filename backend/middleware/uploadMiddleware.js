const multer = require("multer");

// Configuration du stockage des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Stocke les images dans le dossier 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nom unique pour chaque fichier
    }
});

// Filtrer les fichiers (autoriser uniquement les images)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Le fichier doit être une image !"), false);
    }
};

// Initialisation de multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
