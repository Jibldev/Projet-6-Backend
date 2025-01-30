const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");


const uploadFolder = path.join(__dirname, "../uploads");


if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}


const storage = multer.memoryStorage();
const upload = multer({ storage });


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Le fichier doit être une image !"), false);
    }
};


const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const { originalname, buffer } = req.file;
    const filename = `optimized-${Date.now()}-${originalname.replace(/\s+/g, "-")}`;
    const outputPath = path.join(uploadFolder, filename);

    // Optimisation de l'image
    await sharp(buffer)
      .resize(800) 
      .jpeg({ quality: 80 }) 
      .toFile(outputPath);


    req.file.filename = filename;
    req.file.path = outputPath;
    req.file.size = (await fs.promises.stat(outputPath)).size;

    next();
  } catch (error) {
    console.error("Erreur lors du traitement de l'image :", error);
    res.status(500).json({ error: "Problème avec l'optimisation de l'image" });
  }
};

module.exports = { upload, processImage };
