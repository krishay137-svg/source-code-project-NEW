const database = require("../config/database");

/* ======================================================
   Ensure profile columns exist on the users table.
   Runs once at startup; safe to re-run (ALTER TABLE
   fails silently if column already present).
====================================================== */
database.serialize(() => {
    database.run(`ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''`, () => {});
    database.run(`ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT NULL`, () => {});
    database.run(`ALTER TABLE users ADD COLUMN created_at TEXT DEFAULT (datetime('now'))`, () => {});
});

class User {

    static create(userData, callback) {
        database.run(
            "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
            [userData.full_name, userData.email, userData.password],
            callback
        );
    }

    static findByEmail(email, callback) {
        database.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, row) => {
                if (err) return callback(err);
                callback(null, row ? [row] : []);
            }
        );
    }

    static findById(id, callback) {
        database.get(
            "SELECT * FROM users WHERE id = ?",
            [id],
            (err, row) => {
                if (err) return callback(err);
                callback(null, row ? [row] : []);
            }
        );
    }

    static emailExists(email, callback) {
        database.get(
            "SELECT id FROM users WHERE email = ?",
            [email],
            (error, row) => {
                if (error) return callback(error);
                callback(null, !!row);
            }
        );
    }

    /* --------------------------------------------------------
       updateProfile — update display name, bio, avatar_url
    -------------------------------------------------------- */
    static updateProfile(id, data, callback) {
        const { full_name, bio, avatar_url } = data;

        if (avatar_url !== undefined) {
            database.run(
                "UPDATE users SET full_name = ?, bio = ?, avatar_url = ? WHERE id = ?",
                [full_name, bio, avatar_url, id],
                callback
            );
        } else {
            database.run(
                "UPDATE users SET full_name = ?, bio = ? WHERE id = ?",
                [full_name, bio, id],
                callback
            );
        }
    }

    /* --------------------------------------------------------
       getStats — aggregate statistics for a given user
    -------------------------------------------------------- */
    static getStats(id, callback) {
        const sql = `
            SELECT
                (SELECT COUNT(*) FROM notes WHERE user_id = ?)                         AS notes_count,
                (SELECT COALESCE(SUM(downloads), 0) FROM notes WHERE user_id = ?)      AS total_downloads,
                (SELECT COALESCE(AVG(rating), 0)    FROM notes WHERE user_id = ?)      AS avg_rating,
                (SELECT COUNT(*) FROM bookmarks WHERE user_id = ?)                      AS bookmarks_count,
                (SELECT COUNT(*) FROM comments WHERE user_id = ?)                       AS comments_count
        `;
        database.get(sql, [id, id, id, id, id], (err, row) => {
            if (err) return callback(err);
            callback(null, row || {
                notes_count: 0,
                total_downloads: 0,
                avg_rating: 0,
                bookmarks_count: 0,
                comments_count: 0
            });
        });
    }

}

module.exports = User;