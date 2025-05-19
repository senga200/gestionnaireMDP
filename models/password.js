module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Password", {
    service: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    iv: DataTypes.STRING,
  });
};
