const express = require("express");
const router  = express.Router();
const {
    reportNote,
    getReports,
    updateReportStatus
} = require("../controllers/reportController");

/* ======================================================
   EduShare — Report Routes
   Community Features — Part 6
*/

// POST  /api/notes/:id/report          — submit a report (auth required)
router.post("/api/notes/:id/report", reportNote);

// GET   /api/admin/reports             — list all reports (admin only)
//       Query: ?status=pending|resolved|dismissed, ?limit=N
router.get("/api/admin/reports", getReports);

// PATCH /api/admin/reports/:reportId   — update report status (admin only)
router.patch("/api/admin/reports/:reportId", updateReportStatus);

module.exports = router;
