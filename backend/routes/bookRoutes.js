const express = require("express");
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware"); 
const { upload, processImage } = require("../middleware/uploadMiddleware"); 

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", upload.single("image"), processImage, bookController.addBook);
router.post("/:id/rating", authMiddleware, bookController.rateBook);
router.delete("/:id", bookController.deleteBook);


module.exports = router;
