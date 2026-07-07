const database = require("../config/database");

/* ======================================================
   EduShare - Notification Model
   Community Features — Part 6
   Manages in-app notifications for users.
   Notifications are created by the system on events like
   new comments on your notes, new ratings, etc.
*/

class Notification {

    /**
     * create
     * Insert a new notification for a user.
     *
     * @param {Object}   data          - Notification data
     * @param {number}   data.userId   - Recipient user ID
     * @param {string}   data.type     - e.g. 'comment', 'rating', 'report_resolved'
     * @param {string}   data.message  - Human-readable notification text
     * @param {number}   [data.noteId] - Associated note (optional)
     * @param {Function} callback      - (err, { id })
     */
    static create(data, callback) {
        database.run(
            "INSERT INTO notifications (user_id, type, message, note_id) VALUES (?, ?, ?, ?)",
            [data.userId, data.type, data.message, data.noteId || null],
            function (err) {
                if (err) return callback(err);
                callback(null, { id: this.lastID });
            }
        );
    }

    /**
     * getByUser
     * Returns all notifications for a user, newest first.
     *
     * @param {number}   userId   - Recipient user ID
     * @param {Object}   [opts]   - Options: { onlyUnread: boolean, limit: number }
     * @param {Function} callback - (err, rows)
     */
    static getByUser(userId, opts = {}, callback) {
        const { onlyUnread = false, limit = 50 } = opts;
        const conditions = ["user_id = ?"];
        if (onlyUnread) conditions.push("is_read = 0");

        database.all(
            `SELECT id, type, message, note_id, is_read, created_at
             FROM   notifications
             WHERE  ${conditions.join(" AND ")}
             ORDER  BY created_at DESC
             LIMIT  ?`,
            [userId, parseInt(limit)],
            (err, rows) => {
                if (err) return callback(err);
                callback(null, rows);
            }
        );
    }

    /**
     * getUnreadCount
     * Returns the count of unread notifications for a user.
     *
     * @param {number}   userId   - Recipient user ID
     * @param {Function} callback - (err, count)
     */
    static getUnreadCount(userId, callback) {
        database.get(
            "SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0",
            [userId],
            (err, row) => {
                if (err) return callback(err);
                callback(null, row ? row.count : 0);
            }
        );
    }

    /**
     * markRead
     * Mark a specific notification as read.
     *
     * @param {number}   notifId  - Notification ID
     * @param {number}   userId   - Owner (for security check)
     * @param {Function} callback - (err, { changes })
     */
    static markRead(notifId, userId, callback) {
        database.run(
            "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
            [notifId, userId],
            function (err) {
                if (err) return callback(err);
                callback(null, { changes: this.changes });
            }
        );
    }

    /**
     * markAllRead
     * Mark all notifications for a user as read.
     *
     * @param {number}   userId   - Recipient user ID
     * @param {Function} callback - (err, { changes })
     */
    static markAllRead(userId, callback) {
        database.run(
            "UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0",
            [userId],
            function (err) {
                if (err) return callback(err);
                callback(null, { changes: this.changes });
            }
        );
    }

    /**
     * deleteOld
     * Remove notifications older than N days for a user.
     *
     * @param {number}   userId   - Recipient user ID
     * @param {number}   days     - Age threshold in days
     * @param {Function} callback - (err, { changes })
     */
    static deleteOld(userId, days, callback) {
        database.run(
            "DELETE FROM notifications WHERE user_id = ? AND created_at < datetime('now', ?)",
            [userId, `-${days} days`],
            function (err) {
                if (err) return callback(err);
                callback(null, { changes: this.changes });
            }
        );
    }

}

module.exports = Notification;
