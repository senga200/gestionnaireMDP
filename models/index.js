const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./user")(sequelize, Sequelize);
db.Password = require("./password")(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Password, { foreignKey: "userId" });
db.Password.belongsTo(db.User, { foreignKey: "userId" });

module.exports = db;
