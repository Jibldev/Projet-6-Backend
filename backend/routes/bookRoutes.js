const express = require("express");
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware"); // Si nécessaire
const upload = require("../middleware/uploadMiddleware"); // Ajout de multer

const router = express.Router();

router.get("/", bookController.getAllBooks); // Récupérer les livres
router.post("/", upload.single("image"), bookController.addBook); // Ajouter un livre avec image

module.exports = router;
