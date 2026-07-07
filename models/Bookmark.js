const database = require("../config/database");

/* ======================================================
   EduShare - Bookmark Model
   Community Features — Part 6
   Allows users to save (bookmark) notes for later.
   Toggle on/off — unique per (user, note) pair.
*/

class Bookmark {

    /**
     * toggle
     * Add bookmark if not exists, remove if already bookmarked.
     *
     * @param {number}   noteId   - Target note
     * @param {number}   userId   - Authenticated user
     * @param {Function} callback - (err, { bookmarked: boolean })
     */
    static toggle(noteId, userId, callback) {
        database.get(
            "SELECT id FROM bookmarks WHERE note_id = ? AND user_id = ?",
            [noteId, userId],
            (err, existing) => {
                if (err) return callback(err);

                if (existing) {
                    // Remove bookmark
                    database.run(
                        "DELETE FROM bookmarks WHERE note_id = ? AND user_id = ?",
                        [noteId, userId],
                        (err2) => {
                            if (err2) return callback(err2);
                            callback(null, { bookmarked: false });
                        }
                    );
                } else {
                    // Add bookmark
                    database.run(
                        "INSERT INTO bookmarks (note_id, user_id) VALUES (?, ?)",
                        [noteId, userId],
                        (err2) => {
                            if (err2) return callback(err2);
                            callback(null, { bookmarked: true });
                        }
                    );
                }
            }
        );
    }

    /**
     * isBookmarked
     * Check whether a user has bookmarked a note.
     *
     * @param {number}   noteId   - Target note
     * @param {number}   userId   - Authenticated user
     * @param {Function} callback - (err, boolean)
     */
    static isBookmarked(noteId, userId, callback) {
        database.get(
            "SELECT id FROM bookmarks WHERE note_id = ? AND user_id = ?",
            [noteId, userId],
            (err, row) => {
                if (err) return callback(err);
                callback(null, !!row);
            }
        );
    }

    /**
     * getByUser
     * Returns all bookmarked notes for a user, newest first.
     *
     * @param {number}   userId   - Authenticated user
     * @param {Function} callback - (err, rows)
     */
    static getByUser(userId, callback) {
        database.all(
            `SELECT
                n.id,
                n.title,
                n.subject,
                n.description,
                n.file_type,
                n.downloads,
                n.rating,
                n.created_at,
                u.full_name AS author_name,
                b.created_at AS bookmarked_at
             FROM   bookmarks b
             JOIN   notes n ON b.note_id = n.id
             JOIN   users u ON n.user_id = u.id
             WHERE  b.user_id = ?
             ORDER  BY b.created_at DESC`,
            [userId],
            (err, rows) => {
                if (err) return callback(err);
                callback(null, rows);
            }
        );
    }

}

module.exports = Bookmark;
