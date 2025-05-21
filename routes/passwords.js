const express = require("express");
const crypto = require("crypto");
const { Password } = require("../models");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

router.post("/", auth, async (req, res) => {
  const { service, username, password } = req.body;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  const newPassword = await Password.create({
    service,
    username,
    password: encrypted,
    iv: iv.toString("hex"),
    userId: req.userId,
  });

  res.status(201).json(newPassword);
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const deletedCount = await Password.destroy({
    where: { id, userId: req.userId },
  });

  if (deletedCount === 0) {
    return res.status(404).send("Mot de passe non trouvé ou non autorisé");
  }

  res.status(204).send();
});

router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { service, username, password } = req.body;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  await Password.update(
    { service, username, password: encrypted, iv: iv.toString("hex") },
    { where: { id, userId: req.userId } }
  );

  res.status(200).send();
});

router.get("/", auth, async (req, res) => {
  const data = await Password.findAll({ where: { userId: req.userId } });

  const decryptedData = data.map((entry) => {
    const iv = Buffer.from(entry.iv, "hex");
    const encryptedText = entry.password;
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return {
      id: entry.id,
      service: entry.service,
      username: entry.username,
      password: decrypted,
    };
  });

  res.json(decryptedData);
});

module.exports = router;
