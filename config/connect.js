const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { join } = require("path");

const dbPath = join(__dirname, "todos.db");
const connectDB = async () => {
  try {
    let db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database connected successfully");
    return db;
  } catch (error) {
    console.log(`Database connect error: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
