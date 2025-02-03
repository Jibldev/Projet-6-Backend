const Book = require("../models/book");

exports.getTopRatedBooks = async (req, res) => {
  try {
      const { currentBookId } = req.params;


      const topBooks = await Book.find({ _id: { $ne: currentBookId } }) 
          .sort({ averageRating: -1 }) // ✅ Trie par note moyenne décroissante
          .limit(3);


      res.status(200).json(topBooks);
  } catch (error) {
      console.error("❌ Erreur serveur :", error);
      res.status(500).json({ message: "Erreur serveur", error });
  }
};

