const express = require("express");
const router  = express.Router();
const { getComments, addComment, deleteComment } = require("../controllers/commentController");

/* ======================================================
   EduShare — Comment Routes
   Community Features — Part 6
*/

// GET    /api/notes/:id/comments         — list all comments for a note
router.get("/api/notes/:id/comments", getComments);

// POST   /api/notes/:id/comments         — post a new comment (auth required)
router.post("/api/notes/:id/comments", addComment);

// DELETE /api/comments/:commentId        — delete a comment (owner only)
router.delete("/api/comments/:commentId", deleteComment);

module.exports = router;
