const Bookmark = require("../models/Bookmark");

/* ======================================================
   EduShare - Bookmark Controller
   Community Features — Part 6
*/

/**
 * POST /api/notes/:id/bookmark
 * Toggle bookmark on/off for the authenticated user.
 */
exports.toggleBookmark = (req, res) => {

    const noteId = parseInt(req.params.id);
    const userId = req.user && req.user.id;

    if (!userId) {
        return res.status(401).json({ error: "Login required to bookmark notes." });
    }

    Bookmark.toggle(noteId, userId, (err, result) => {
        if (err) {
            console.error("Bookmark toggle error:", err);
            return res.status(500).json({ error: "Failed to update bookmark." });
        }
        res.json({
            message:    result.bookmarked ? "Bookmark added." : "Bookmark removed.",
            bookmarked: result.bookmarked
        });
    });
};

/**
 * GET /api/notes/:id/bookmark-status
 * Returns whether the authenticated user has bookmarked this note.
 */
exports.getBookmarkStatus = (req, res) => {

    const noteId = parseInt(req.params.id);
    const userId = req.user && req.user.id;

    if (!userId) {
        return res.json({ bookmarked: false });
    }

    Bookmark.isBookmarked(noteId, userId, (err, bookmarked) => {
        if (err) {
            console.error("Bookmark status error:", err);
            return res.status(500).json({ error: "Failed to fetch bookmark status." });
        }
        res.json({ bookmarked });
    });
};

/**
 * GET /api/bookmarks
 * Returns all notes bookmarked by the authenticated user.
 */
exports.getUserBookmarks = (req, res) => {

    const userId = req.user && req.user.id;

    if (!userId) {
        return res.status(401).json({ error: "Login required." });
    }

    Bookmark.getByUser(userId, (err, rows) => {
        if (err) {
            console.error("Get bookmarks error:", err);
            return res.status(500).json({ error: "Failed to fetch bookmarks." });
        }
        res.json(rows);
    });
};
