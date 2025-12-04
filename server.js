require("dotenv").config();
const logger = require("./src/utils/logger");
const app = require("./app");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Edudiscovery API running on port ${PORT}`);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
