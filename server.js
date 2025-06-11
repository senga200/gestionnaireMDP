const express = require("express");
require("dotenv").config();
const db = require("./models");
const path = require("path");
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/passwords");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/passwords", passwordRoutes);
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// Sync DB
db.sequelize.sync().then(() => {
  console.log("Base de données t es  synchro sequelize");
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});

db.sequelize
  .authenticate()
  .then(() => console.log("Connexion à la BDD réussie"))
  .catch((err) => console.error("Erreur de connexion BDD", err));
