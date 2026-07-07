const express = require("express");
const router  = express.Router();
const { rateNote, getNoteRatings } = require("../controllers/ratingController");

/* ======================================================
   EduShare — Rating Routes
   Community Features — Part 6
   Base: /api/notes/:id
*/

// GET  /api/notes/:id/ratings  — fetch aggregate rating for a note
router.get("/api/notes/:id/ratings", getNoteRatings);

// POST /api/notes/:id/rate     — submit / update a rating (auth required)
router.post("/api/notes/:id/rate", rateNote);

module.exports = router;
