const express = require("express");
const router  = express.Router();
const {
    getNotifications,
    getUnreadCount,
    markRead,
    markAllRead
} = require("../controllers/notificationController");

/* ======================================================
   EduShare — Notification Routes
   Community Features — Part 6
*/

// GET   /api/notifications               — list notifications (auth required)
//       Query: ?unread=true, ?limit=N
router.get("/api/notifications", getNotifications);

// GET   /api/notifications/unread-count  — badge count for navbar
router.get("/api/notifications/unread-count", getUnreadCount);

// PATCH /api/notifications/read-all      — mark all as read
router.patch("/api/notifications/read-all", markAllRead);

// PATCH /api/notifications/:notifId/read — mark single notification as read
router.patch("/api/notifications/:notifId/read", markRead);

module.exports = router;
