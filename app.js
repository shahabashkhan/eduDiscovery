require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./src/utils/logger");
const errorMiddleware = require("./src/middlewares/error.middleware");
const authRoutes = require("./src/routes/auth.routes");
const schoolRoutes = require("./src/routes/school.routes");
const counsellingRoutes = require("./src/routes/counselling.routes")

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/counselling", counsellingRoutes);


app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use(errorMiddleware);

module.exports = app;
