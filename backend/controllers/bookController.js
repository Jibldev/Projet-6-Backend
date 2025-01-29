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

