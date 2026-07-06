
require("dotenv").config();
console.log(process.env.SESSION_SECRET);
const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const indexRoutes = require("./routes/indexRoutes");
const database = require("./config/database");

const app = express();

const PORT = process.env.PORT || 3000;

/* -------------------------- Middleware -------------------------- */

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", indexRoutes);

/* -------------------------- 404 Handler -------------------------- */

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

/* -------------------------- Start Server ------------------------- */

app.listen(PORT, () => {
    console.log("=====================================");
    console.log("EduShare Server Running Successfully");
    console.log("=====================================");
    console.log(`Server : http://localhost:${PORT}`);
});