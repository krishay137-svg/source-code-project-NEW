const express = require("express");
const router  = express.Router();
const {
    toggleBookmark,
    getBookmarkStatus,
    getUserBookmarks
} = require("../controllers/bookmarkController");

/* ======================================================
   EduShare — Bookmark Routes
   Community Features — Part 6
*/

// GET  /api/bookmarks              — list all bookmarks for the logged-in user
router.get("/api/bookmarks", getUserBookmarks);

// GET  /api/notes/:id/bookmark-status  — check if note is bookmarked
router.get("/api/notes/:id/bookmark-status", getBookmarkStatus);

// POST /api/notes/:id/bookmark     — toggle bookmark (auth required)
router.post("/api/notes/:id/bookmark", toggleBookmark);

module.exports = router;
