const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "database", "edushare.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to connect to SQLite database:", err.message);
    } else {
        console.log("Connected to SQLite database:", dbPath);
    }
});

db.run("PRAGMA journal_mode=WAL");
db.run("PRAGMA foreign_keys=ON");

module.exports = db;
