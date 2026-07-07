const Report      = require("../models/Report");
const Notification = require("../models/Notification");

/* ======================================================
   EduShare - Report Controller
   Community Features — Part 6
*/

const VALID_REASONS = ["plagiarism", "inappropriate", "misleading", "spam", "other"];

/**
 * POST /api/notes/:id/report
 * Submit a report for a note. Requires authentication.
 */
exports.reportNote = (req, res) => {

    const noteId     = parseInt(req.params.id);
    const reporterId = req.user && req.user.id;
    const reason     = (req.body.reason || "").trim();
    const details    = (req.body.details || "").trim();

    if (!reporterId) {
        return res.status(401).json({ error: "Login required to report notes." });
    }

    if (!reason || !VALID_REASONS.includes(reason)) {
        return res.status(400).json({ error: "Please select a valid report reason.", valid: VALID_REASONS });
    }

    // Prevent duplicate reports from the same user
    Report.hasReported(noteId, reporterId, (err, alreadyReported) => {
        if (err) {
            console.error("Report check error:", err);
            return res.status(500).json({ error: "Failed to submit report." });
        }

        if (alreadyReported) {
            return res.status(409).json({ error: "You have already reported this note." });
        }

        Report.create({ noteId, reporterId, reason, details }, (err2, result) => {
            if (err2) {
                console.error("Create report error:", err2);
                return res.status(500).json({ error: "Failed to submit report." });
            }

            // Notify admins (simplified: notify user_id = 1 as admin placeholder)
            Notification.create({
                userId:  1,
                type:    "report",
                message: `A note (ID: ${noteId}) was reported for: ${reason}.`,
                noteId
            }, () => {}); // Fire-and-forget

            res.status(201).json({
                message:  "Report submitted. Our team will review it shortly.",
                reportId: result.id
            });
        });
    });
};

/**
 * GET /api/admin/reports
 * Returns all reports for admin review.
 * Query param: ?status=pending|resolved|dismissed
 */
exports.getReports = (req, res) => {

    const { status, limit } = req.query;

    Report.getAll({ status, limit: parseInt(limit) || 100 }, (err, rows) => {
        if (err) {
            console.error("Get reports error:", err);
            return res.status(500).json({ error: "Failed to fetch reports." });
        }
        res.json(rows);
    });
};

/**
 * PATCH /api/admin/reports/:reportId
 * Update the status of a report.
 */
exports.updateReportStatus = (req, res) => {

    const reportId = parseInt(req.params.reportId);
    const status   = req.body.status;

    if (!["pending", "resolved", "dismissed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Use: pending, resolved, or dismissed." });
    }

    Report.updateStatus(reportId, status, (err, result) => {
        if (err) {
            console.error("Update report error:", err);
            return res.status(500).json({ error: "Failed to update report." });
        }
        if (result.changes === 0) {
            return res.status(404).json({ error: "Report not found." });
        }
        res.json({ message: `Report marked as ${status}.` });
    });
};
