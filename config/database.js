const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((error) => {
    if (error) {
        console.error("❌ MySQL Connection Failed");
        console.error(error.message);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

module.exports = connection;