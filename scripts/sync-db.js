const db = require("../src/models");
const logger = require("../src/utils/logger");

(async () => {
  try {
    await db.sequelize.sync({ alter: true });
    logger.info("📌 Database synced successfully");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Error syncing database:", error);
    process.exit(1);
  }
})();
