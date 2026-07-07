const path    = require("path");
const multer  = require("multer");
const User    = require("../models/User");

/* ======================================================
   Multer — avatar uploads
====================================================== */
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads", "avatars"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar-${req.session.user.id}-${Date.now()}${ext}`);
    }
});

const avatarFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (jpg, png, webp, gif) are allowed."), false);
    }
};

exports.upload = multer({
    storage: avatarStorage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
    fileFilter: avatarFilter
});

/* ======================================================
   GET /api/profile
   Returns the authenticated user's profile + stats.
====================================================== */
exports.getProfile = (req, res) => {

    const userId = req.session.user.id;

    User.findById(userId, (err, rows) => {

        if (err) {
            console.error("profileController.getProfile findById:", err);
            return res.status(500).json({ error: "Database error." });
        }

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const { password: _, ...safeUser } = rows[0];

        User.getStats(userId, (statsErr, stats) => {

            if (statsErr) {
                console.error("profileController.getProfile getStats:", statsErr);
                return res.status(500).json({ error: "Database error." });
            }

            return res.json({ user: safeUser, stats });
        });
    });
};

/* ======================================================
   PUT /api/profile
   Update full_name and bio.
====================================================== */
exports.updateProfile = (req, res) => {

    const userId = req.session.user.id;
    const { full_name, bio } = req.body;

    if (!full_name || full_name.trim().length === 0) {
        return res.status(400).json({ error: "Full name is required." });
    }

    User.updateProfile(userId, { full_name: full_name.trim(), bio: bio || "" }, (err) => {

        if (err) {
            console.error("profileController.updateProfile:", err);
            return res.status(500).json({ error: "Failed to update profile." });
        }

        /* Update session so navbar shows correct name */
        req.session.user.full_name = full_name.trim();

        req.session.save(() => {
            return res.json({ message: "Profile updated successfully." });
        });
    });
};

/* ======================================================
   POST /api/profile/avatar
   Upload a new profile picture.
====================================================== */
exports.uploadAvatar = (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const userId    = req.session.user.id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    User.updateProfile(userId, {
        full_name:  req.session.user.full_name,
        bio:        "",
        avatar_url: avatarUrl
    }, (err) => {

        if (err) {
            console.error("profileController.uploadAvatar:", err);
            return res.status(500).json({ error: "Failed to save avatar." });
        }

        return res.json({ message: "Avatar updated.", avatar_url: avatarUrl });
    });
};

/* ======================================================
   GET /api/dashboard
   Returns summary data for the dashboard page.
====================================================== */
exports.getDashboard = (req, res) => {

    const userId = req.session.user.id;

    User.findById(userId, (err, rows) => {

        if (err || !rows || rows.length === 0) {
            return res.status(500).json({ error: "Database error." });
        }

        const { password: _, ...safeUser } = rows[0];

        User.getStats(userId, (statsErr, stats) => {

            if (statsErr) {
                return res.status(500).json({ error: "Database error." });
            }

            return res.json({ user: safeUser, stats });
        });
    });
};
