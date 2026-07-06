const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { upload, handleMulterError } = require("../middleware/uploadMiddleware");

router.get("/api/notes", noteController.listNotes);
router.get("/api/notes/my", noteController.getMyNotes);
router.get("/api/notes/:id", noteController.getNote);
router.get("/api/notes/:id/download", noteController.downloadNote);
router.post("/api/notes", upload.single("file"), handleMulterError, noteController.createNote);
router.put("/api/notes/:id", upload.single("file"), handleMulterError, noteController.updateNote);
router.delete("/api/notes/:id", noteController.deleteNote);

module.exports = router;
