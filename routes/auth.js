const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Erreur lors de l’enregistrement" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send("Identifiants invalides");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Identifiants invalides");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Envoie le token dans un cookie HttpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true en prod
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
    });

    res.json({ message: "Connecté avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

// Route pour obtenir l utilisateur connecté
router.get("/me", authMiddleware, (req, res) => {
  res.json({ userId: req.userId });
});

module.exports = router;
