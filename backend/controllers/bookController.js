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
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    console.log("📚 Livre récupéré :", book); // ✅ Vérifier les données envoyées au frontend

    res.json(book);
  } catch (error) {
    console.error("Erreur serveur lors de la récupération du livre :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter un livre
exports.addBook = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const { title, author, year, genre, ratings } = req.body;
    if (!title || !author || !year || !genre) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newBook = new Book({
      title,
      author,
      year,
      genre,
      imageUrl,
      userId: req.user.userId,
      ratings: ratings ? JSON.parse(ratings) : [],
      averageRating: JSON.parse(ratings)[0].grade,
    });
    console.log("rating");
    console.log(newBook.ratings);

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre :", error);
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
