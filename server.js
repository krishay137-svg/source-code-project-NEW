require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

require("./config/database");

const indexRoutes  = require("./routes/indexRoutes");
const authRoutes   = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

/* ---------------- Middleware ---------------- */

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use(session({

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false

}));

app.use(express.static(path.join(__dirname, "public")));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

/* ---------------- Routes ---------------- */

app.use("/", indexRoutes);

app.use("/", authRoutes);

app.use("/", searchRoutes);

/* ---------------- 404 ---------------- */

app.use((req, res) => {

    res.status(404).sendFile(

        path.join(__dirname, "views", "404.html")

    );

});

/* ---------------- Server ---------------- */

app.listen(PORT, () => {

    console.log("=====================================");
    console.log("EduShare Server Running Successfully");
    console.log("=====================================");
    console.log(`Server : http://localhost:${PORT}`);

});