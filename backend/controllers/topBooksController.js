const Book = require("../models/book");

exports.getTopRatedBooks = async (req, res) => {
  try {
      const { currentBookId } = req.params;

      console.log("📌 API appelée pour exclure le livre ID :", currentBookId);

      const topBooks = await Book.find({ _id: { $ne: currentBookId } }) 
          .sort({ averageRating: -1 }) // ✅ Trie par note moyenne décroissante
          .limit(3);

      console.log("📌 Livres les mieux notés retournés :", topBooks);

      res.status(200).json(topBooks);
  } catch (error) {
      console.error("❌ Erreur serveur :", error);
      res.status(500).json({ message: "Erreur serveur", error });
  }
};

