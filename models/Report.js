const database = require("../config/database");

/* ======================================================
   EduShare - Report Model
   Community Features — Part 6
   Allows users to flag notes for inappropriate content,
   plagiarism, or other policy violations.
*/

class Report {

    /**
     * create
     * Submit a new report for a note.
     *
     * @param {Object}   data            - Report data
     * @param {number}   data.noteId     - Reported note
     * @param {number}   data.reporterId - User filing the report
     * @param {string}   data.reason     - Short reason category
     * @param {string}   [data.details]  - Additional context
     * @param {Function} callback        - (err, { id })
     */
    static create(data, callback) {
        database.run(
            "INSERT INTO reports (note_id, reporter_id, reason, details) VALUES (?, ?, ?, ?)",
            [data.noteId, data.reporterId, data.reason, data.details || null],
            function (err) {
                if (err) return callback(err);
                callback(null, { id: this.lastID });
            }
        );
    }

    /**
     * getAll
     * Returns all reports (for admin review), newest first.
     *
     * @param {Object}   [opts]         - Options: { status, limit }
     * @param {Function} callback       - (err, rows)
     */
    static getAll(opts = {}, callback) {
        const { status = null, limit = 100 } = opts;
        const conditions = [];
        const values     = [];

        if (status) {
            conditions.push("r.status = ?");
            values.push(status);
        }

        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        database.all(
            `SELECT
                r.id,
                r.reason,
                r.details,
                r.status,
                r.created_at,
                n.title     AS note_title,
                u.full_name AS reporter_name,
                r.note_id,
                r.reporter_id
             FROM   reports r
             JOIN   notes n ON r.note_id     = n.id
             JOIN   users u ON r.reporter_id = u.id
             ${where}
             ORDER  BY r.created_at DESC
             LIMIT  ?`,
            [...values, parseInt(limit)],
            (err, rows) => {
                if (err) return callback(err);
                callback(null, rows);
            }
        );
    }

    /**
     * updateStatus
     * Update the status of a report (pending → resolved / dismissed).
     *
     * @param {number}   reportId - Report ID
     * @param {string}   status   - New status
     * @param {Function} callback - (err, { changes })
     */
    static updateStatus(reportId, status, callback) {
        database.run(
            "UPDATE reports SET status = ? WHERE id = ?",
            [status, reportId],
            function (err) {
                if (err) return callback(err);
                callback(null, { changes: this.changes });
            }
        );
    }

    /**
     * hasReported
     * Check whether a user has already reported a specific note.
     *
     * @param {number}   noteId     - Target note
     * @param {number}   reporterId - Reporting user
     * @param {Function} callback   - (err, boolean)
     */
    static hasReported(noteId, reporterId, callback) {
        database.get(
            "SELECT id FROM reports WHERE note_id = ? AND reporter_id = ?",
            [noteId, reporterId],
            (err, row) => {
                if (err) return callback(err);
                callback(null, !!row);
            }
        );
    }

}

module.exports = Report;
