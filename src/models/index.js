"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const logger = require("../utils/logger");

const basename = path.basename(__filename);
const db = {};

// ⭐ Initialize Sequelize using DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: (msg) => logger.info(msg),
});

// ⭐ Test connection
sequelize
  .authenticate()
  .then(() => logger.info("PostgreSQL connected successfully"))
  .catch((err) => {
    logger.error("Unable to connect to DB:", err);
    process.exit(1);
  });

// ⭐ Load all model files
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
  )
  .forEach((file) => {
    console.log("Loading model:", file);
    const model = require(path.join(__dirname, file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  });

// ⭐ Apply model relationships
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
