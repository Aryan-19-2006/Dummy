
require("dotenv").config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Set a JWT_SECRET of at least 32 characters in backend/.env");
}

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  const connection = await db.getConnection();

  try {
    await connection.ping();
    console.log("MySQL connected successfully");
  } finally {
    connection.release();
  }

  app.listen(PORT, () => {
    console.log(`ERP API running at http://localhost:${PORT}`);
  });
}

startServer().catch(error => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
