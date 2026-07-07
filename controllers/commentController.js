const Comment = require("../models/Comment");

/* ======================================================
   EduShare - Comment Controller
   Community Features — Part 6
*/

/**
 * GET /api/notes/:id/comments
 * Returns all approved comments for a note.
 */
exports.getComments = (req, res) => {

    const noteId = parseInt(req.params.id);

    Comment.getByNote(noteId, (err, rows) => {
        if (err) {
            console.error("Get comments error:", err);
            return res.status(500).json({ error: "Failed to fetch comments." });
        }
        res.json(rows);
    });
};

/**
 * POST /api/notes/:id/comments
 * Add a new comment. Requires authentication.
 */
exports.addComment = (req, res) => {

    const noteId = parseInt(req.params.id);
    const userId = req.user && req.user.id;
    const body   = (req.body.body || "").trim();

    if (!userId) {
        return res.status(401).json({ error: "Login required to comment." });
    }

    if (!body || body.length < 1) {
        return res.status(400).json({ error: "Comment cannot be empty." });
    }

    if (body.length > 1000) {
        return res.status(400).json({ error: "Comment must be 1000 characters or fewer." });
    }

    Comment.create(noteId, userId, body, (err, result) => {
        if (err) {
            console.error("Add comment error:", err);
            return res.status(500).json({ error: "Failed to post comment." });
        }

        // Return the newly created comment with author info
        Comment.getByNote(noteId, (err2, rows) => {
            if (err2) return res.status(201).json({ message: "Comment posted.", id: result.id });
            const newComment = rows.find((r) => r.id === result.id);
            res.status(201).json({ message: "Comment posted.", comment: newComment });
        });
    });
};

/**
 * DELETE /api/comments/:commentId
 * Remove a comment. Only the author can delete their own.
 */
exports.deleteComment = (req, res) => {

    const commentId = parseInt(req.params.commentId);
    const userId    = req.user && req.user.id;

    if (!userId) {
        return res.status(401).json({ error: "Login required." });
    }

    Comment.delete(commentId, userId, (err, result) => {
        if (err) {
            console.error("Delete comment error:", err);
            return res.status(500).json({ error: "Failed to delete comment." });
        }
        if (result.changes === 0) {
            return res.status(404).json({ error: "Comment not found or not authorized." });
        }
        res.json({ message: "Comment deleted." });
    });
};
