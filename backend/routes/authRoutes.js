const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");

const router = express.Router();

// 📌 Route d'inscription
router.post(
    "/signup",
    [
        check("email", "Veuillez entrer un email valide").isEmail(),
        check("password", "Le mot de passe doit contenir au moins 6 caractères").isLength({ min: 6 })
    ],
    authController.signup
);

router.post("/login", authController.login);


module.exports = router;
