require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

require("./config/database");

const indexRoutes        = require("./routes/indexRoutes");
const authRoutes         = require("./routes/authRoutes");
const noteRoutes         = require("./routes/noteRoutes");
const searchRoutes       = require("./routes/searchRoutes");

/* ---- Dashboard & Profile Routes (Part 7) ---- */
const profileRoutes      = require("./routes/profileRoutes");

/* ---- Community Feature Routes (Part 6) ---- */
const ratingRoutes       = require("./routes/ratingRoutes");
const commentRoutes      = require("./routes/commentRoutes");
const bookmarkRoutes     = require("./routes/bookmarkRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes       = require("./routes/reportRoutes");

const { errorHandler, notFound } = require("./middleware/errorMiddleware");

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

/* Ensure avatars directory exists */
const fs = require("fs");
fs.mkdirSync(path.join(__dirname, "uploads", "avatars"), { recursive: true });

/* ---------------- Routes ---------------- */

app.use("/", indexRoutes);

app.use("/", authRoutes);

app.use("/", noteRoutes);

app.use("/", searchRoutes);

/* ---- Dashboard & Profile Routes (Part 7) ---- */

app.use("/", profileRoutes);

/* ---- Community Feature Routes (Part 6) ---- */

app.use("/", ratingRoutes);

app.use("/", commentRoutes);

app.use("/", bookmarkRoutes);

app.use("/", notificationRoutes);

app.use("/", reportRoutes);

/* ---------------- Error Handling ---------------- */

app.use(notFound);

app.use(errorHandler);

/* ---------------- Server ---------------- */

app.listen(PORT, () => {

    console.log("=====================================");
    console.log("EduShare Server Running Successfully");
    console.log("=====================================");
    console.log(`Server : http://localhost:${PORT}`);

});