const view    = require("../utils/view");
const Note    = require("../models/Note");
const Subject = require("../models/Subject");
const Tag     = require("../models/Tag");

/* ======================================================
   EduShare - Search Controller
   Part 5 — Search & Discovery
   All JSON API endpoints return: { success, ...payload }
====================================================== */

/**
 * showSearch
 * GET /search
 * Renders the search page (publicly accessible — no auth required).
 */
exports.showSearch = (req, res) => {

    view("search", res);

};

/**
 * searchNotes
 * GET /search/results
 * JSON API — search notes with keyword, subject, tag, and sort filters.
 * Supports pagination via page and limit query params.
 */
exports.searchNotes = (req, res) => {

    const keyword    = (req.query.keyword    || "").trim();
    const subject_id = req.query.subject_id  || null;
    const tag        = (req.query.tag        || "").trim() || null;
    const sort       = req.query.sort        || "newest";
    const page       = Math.max(1,  parseInt(req.query.page)  || 1);
    const limit      = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));

    const params = { keyword, subject_id, tag, sort, page, limit };

    Note.search(params, (err, notes) => {

        if (err) {
            console.error("[searchNotes] Search error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Search failed. Please try again."
            });
        }

        Note.searchCount(params, (countErr, countResult) => {

            if (countErr) {
                console.error("[searchNotes] Count error:", countErr.message);
                return res.status(500).json({
                    success: false,
                    message: "Search failed. Please try again."
                });
            }

            const total      = (countResult[0] && countResult[0].total) || 0;
            const totalPages = Math.ceil(total / limit);

            // Parse GROUP_CONCAT tag strings into proper arrays
            const enrichedNotes = notes.map(note => ({
                ...note,
                tags: note.tags ? note.tags.split(",") : []
            }));

            return res.json({
                success: true,
                notes:   enrichedNotes,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages
                }
            });

        });

    });

};

/**
 * getTrending
 * GET /search/trending
 * JSON API — most-downloaded notes (up to 10).
 */
exports.getTrending = (req, res) => {

    const limit = Math.min(10, Math.max(1, parseInt(req.query.limit) || 6));

    Note.getTrending(limit, (err, notes) => {

        if (err) {
            console.error("[getTrending] Error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Failed to load trending notes."
            });
        }

        return res.json({ success: true, notes });

    });

};

/**
 * getCategories
 * GET /search/categories
 * JSON API — all subjects/categories, ordered alphabetically.
 */
exports.getCategories = (req, res) => {

    Subject.getAll((err, subjects) => {

        if (err) {
            console.error("[getCategories] Error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Failed to load categories."
            });
        }

        return res.json({ success: true, subjects });

    });

};

/**
 * getPopularTags
 * GET /search/tags
 * JSON API — most-used tags across all approved notes (up to 20).
 */
exports.getPopularTags = (req, res) => {

    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 15));

    Tag.getPopular(limit, (err, tags) => {

        if (err) {
            console.error("[getPopularTags] Error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Failed to load tags."
            });
        }

        return res.json({ success: true, tags });

    });

};

/**
 * getRelated
 * GET /search/related/:id
 * JSON API — notes in the same subject as the given note ID,
 * ordered by download count, excluding the note itself.
 */
exports.getRelated = (req, res) => {

    const noteId = parseInt(req.params.id);

    if (!noteId || noteId < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid note ID."
        });
    }

    const limit = Math.min(6, Math.max(1, parseInt(req.query.limit) || 4));

    Note.findById(noteId, (err, results) => {

        if (err) {
            console.error("[getRelated] findById error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Failed to load related notes."
            });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        const note = results[0];

        // No subject means no related notes to retrieve
        if (!note.subject_id) {
            return res.json({ success: true, notes: [] });
        }

        Note.getRelated(noteId, note.subject_id, limit, (relErr, related) => {

            if (relErr) {
                console.error("[getRelated] getRelated error:", relErr.message);
                return res.status(500).json({
                    success: false,
                    message: "Failed to load related notes."
                });
            }

            return res.json({ success: true, notes: related });

        });

    });

};
