const express = require("express");
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware"); 
const { upload, processImage } = require("../middleware/uploadMiddleware"); 

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.post("/", upload.single("image"), processImage, bookController.addBook);
router.delete("/:id", bookController.deleteBook);


module.exports = router;
