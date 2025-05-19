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
  console.log("Base de données synchronisée");
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});
