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

exports.getBookById = async (req, res) => {
  try {
    console.log("Requête reçue pour l'ID :", req.params.id); // Log de l'ID
    const book = await Book.findById(req.params.id);

    if (!book) {
      console.log("Livre non trouvé pour ID :", req.params.id);
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    console.log("Livre trouvé :", book);
    res.json(book);
  } catch (error) {
    console.error("Erreur serveur lors de la récupération du livre :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Ajouter un livre
exports.addBook = async (req, res) => {
  try {
    console.log("Fichier reçu :", req.file);
    console.log("Corps de la requête :", req.body);

    const bookData = JSON.parse(req.body.book);

    const { title, author, year, genre, ratings, averageRating } = bookData;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !author || !year || !genre || !ratings || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Tous les champs et une image sont requis !" });
    }

    const newBook = new Book({
      title,
      author,
      year,
      genre,
      ratings,
      averageRating,
      imageUrl,
    });
    const savedBook = await newBook.save();

    res.status(201).json(savedBook);
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.rateBook = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rating } = req.body;
    const bookId = req.params.id;

    if (rating === undefined) {
      return res.status(400).json({ message: "Une note est requise." });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const existingRating = book.ratings.find((r) => r.userId === userId);
    if (existingRating) {
      existingRating.grade = rating;
    } else {
      book.ratings.push({ userId, grade: rating });
    }

    book.calculateAverageRating();

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la notation :", error);
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


    if (book.imageUrl) {
      const imagePath = path.join(__dirname, "../", book.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Erreur lors de la suppression de l'image :", err);
        }
      });
    }


    await Book.findByIdAndDelete(bookId);

    res.status(200).json({ message: "Livre et image supprimés avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
