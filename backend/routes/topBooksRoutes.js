const express = require("express");
const router = express.Router();
const { getTopRatedBooks } = require("../controllers/topBooksController");

// Route pour récupérer les meilleurs livres (excluant le livre actuel)
router.get("/:currentBookId", getTopRatedBooks);

module.exports = router;
