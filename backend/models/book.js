const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: {
        type: Number, min: 0, max: 5, required: true,
      },
    },
  ],
  averageRating: { type: Number, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

bookSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const total = this.ratings.reduce((sum, ratings) => sum + ratings.grade, 0);
    this.averageRating = (total / this.ratings.length).toFixed(1);
  }
};


module.exports = mongoose.model('Book', bookSchema);
