const Notification = require("../models/Notification");

/* ======================================================
   EduShare - Notification Controller
   Community Features — Part 6
*/

/**
 * GET /api/notifications
 * Returns notifications for the authenticated user.
 * Query param: ?unread=true  — only unread; ?limit=N — max results.
 */
exports.getNotifications = (req, res) => {

    const userId    = req.user && req.user.id;
    const onlyUnread = req.query.unread === "true";
    const limit      = parseInt(req.query.limit) || 50;

    if (!userId) {
        return res.status(401).json({ error: "Login required." });
    }

    Notification.getByUser(userId, { onlyUnread, limit }, (err, rows) => {
        if (err) {
            console.error("Get notifications error:", err);
            return res.status(500).json({ error: "Failed to fetch notifications." });
        }
        res.json(rows);
    });
};

/**
 * GET /api/notifications/unread-count
 * Returns the count of unread notifications.
 */
exports.getUnreadCount = (req, res) => {

    const userId = req.user && req.user.id;

    if (!userId) {
        return res.json({ count: 0 });
    }

    Notification.getUnreadCount(userId, (err, count) => {
        if (err) {
            console.error("Unread count error:", err);
            return res.status(500).json({ error: "Failed to fetch unread count." });
        }
        res.json({ count });
    });
};

/**
 * PATCH /api/notifications/:notifId/read
 * Mark a single notification as read.
 */
exports.markRead = (req, res) => {

    const notifId = parseInt(req.params.notifId);
    const userId  = req.user && req.user.id;

    if (!userId) {
        return res.status(401).json({ error: "Login required." });
    }

    Notification.markRead(notifId, userId, (err, result) => {
        if (err) {
            console.error("Mark read error:", err);
            return res.status(500).json({ error: "Failed to update notification." });
        }
        if (result.changes === 0) {
            return res.status(404).json({ error: "Notification not found." });
        }
        res.json({ message: "Notification marked as read." });
    });
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications for the user as read.
 */
exports.markAllRead = (req, res) => {

    const userId = req.user && req.user.id;

    if (!userId) {
        return res.status(401).json({ error: "Login required." });
    }

    Notification.markAllRead(userId, (err, result) => {
        if (err) {
            console.error("Mark all read error:", err);
            return res.status(500).json({ error: "Failed to update notifications." });
        }
        res.json({ message: `${result.changes} notification(s) marked as read.` });
    });
};
