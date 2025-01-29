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
      console.log("✅ Corps de la requête:", req.body);
      console.log("✅ Fichier uploadé:", req.file);

      const { title, author, year, genre, rating } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      if (!title || !author || !year || !genre || !rating || !imageUrl) {
          return res.status(400).json({ message: "Tous les champs et une image sont requis !" });
      }

      const newBook = new Book({ title, author, year, genre, rating, imageUrl });
      const savedBook = await newBook.save();

      res.status(201).json(savedBook);
  } catch (err) {
      console.error("❌ Erreur lors de l'ajout du livre :", err);
      res.status(500).json({ message: "Erreur serveur" });
  }
};
