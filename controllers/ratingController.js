const Rating = require("../models/Rating");

/* ======================================================
   EduShare - Rating Controller
   Community Features — Part 6
*/

/**
 * POST /api/notes/:id/rate
 * Submit or update a star rating (1–5) for a note.
 * Requires authentication.
 */
exports.rateNote = (req, res) => {

    const noteId = parseInt(req.params.id);
    const userId = req.user && req.user.id;
    const value  = parseInt(req.body.rating);

    if (!userId) {
        return res.status(401).json({ error: "Login required to rate notes." });
    }

    if (!value || value < 1 || value > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    Rating.upsert(noteId, userId, value, (err, result) => {
        if (err) {
            console.error("Rating error:", err);
            return res.status(500).json({ error: "Failed to save rating." });
        }
        res.json({
            message:      "Rating saved.",
            avgRating:    result.avgRating,
            totalRatings: result.totalRatings
        });
    });
};

/**
 * GET /api/notes/:id/ratings
 * Returns the aggregate rating info for a note.
 */
exports.getNoteRatings = (req, res) => {

    const noteId = parseInt(req.params.id);

    Rating.getForNote(noteId, (err, result) => {
        if (err) {
            console.error("Get ratings error:", err);
            return res.status(500).json({ error: "Failed to fetch ratings." });
        }
        res.json(result);
    });
};
