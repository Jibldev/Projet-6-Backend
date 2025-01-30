const Book = require("../models/book");

// Récupérer tous les livres
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Ajouter un livre
exports.addBook = async (req, res) => {
  try {
      console.log("Fichier reçu :", req.file);
      console.log("Corps de la requête :", req.body);

      // On parse les données reçues pour récupérer un vrai objet JSON
      const bookData = JSON.parse(req.body.book);

      const { title, author, year, genre, ratings, averageRating } = bookData;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      if (!title || !author || !year || !genre || !ratings || !imageUrl) {
          return res.status(400).json({ message: "Tous les champs et une image sont requis !" });
      }

      const newBook = new Book({ title, author, year, genre, ratings, averageRating, imageUrl });
      const savedBook = await newBook.save();

      res.status(201).json(savedBook);
  } catch (err) {
      console.error("Erreur serveur :", err);
      res.status(500).json({ message: "Erreur serveur" });
  }
};

const fs = require("fs");
const path = require("path");

// Supprimer un livre et son image associée
exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }

        // Vérifier s'il y a une image et la supprimer
        if (book.imageUrl) {
            const imagePath = path.join(__dirname, "../", book.imageUrl); // Récupération du chemin
            fs.unlink(imagePath, (err) => {
                if (err && err.code !== "ENOENT") {
                    console.error("Erreur lors de la suppression de l'image :", err);
                }
            });
        }

        // Supprimer le livre de la base de données
        await Book.findByIdAndDelete(bookId);

        res.status(200).json({ message: "Livre et image supprimés avec succès" });
    } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

