const database = require("../config/database");

/* ======================================================
   EduShare - Comment Model
   Community Features — Part 6
   Supports creating, listing, and deleting comments on notes.
*/

class Comment {

    /**
     * create
     * Add a new comment to a note.
     *
     * @param {number}   noteId   - Target note
     * @param {number}   userId   - Authenticated user
     * @param {string}   body     - Comment text
     * @param {Function} callback - (err, { id })
     */
    static create(noteId, userId, body, callback) {
        database.run(
            "INSERT INTO comments (note_id, user_id, body) VALUES (?, ?, ?)",
            [noteId, userId, body.trim()],
            function (err) {
                if (err) return callback(err);
                callback(null, { id: this.lastID });
            }
        );
    }

    /**
     * getByNote
     * Returns all comments for a note, newest first, with author name.
     *
     * @param {number}   noteId   - Target note
     * @param {Function} callback - (err, rows)
     */
    static getByNote(noteId, callback) {
        database.all(
            `SELECT
                c.id,
                c.body,
                c.created_at,
                u.full_name AS author_name
             FROM   comments c
             JOIN   users    u ON c.user_id = u.id
             WHERE  c.note_id = ?
             ORDER  BY c.created_at DESC`,
            [noteId],
            (err, rows) => {
                if (err) return callback(err);
                callback(null, rows);
            }
        );
    }

    /**
     * delete
     * Remove a comment. Only the author (or admin) may delete.
     *
     * @param {number}   commentId - Target comment
     * @param {number}   userId    - Requesting user
     * @param {Function} callback  - (err, { changes })
     */
    static delete(commentId, userId, callback) {
        database.run(
            "DELETE FROM comments WHERE id = ? AND user_id = ?",
            [commentId, userId],
            function (err) {
                if (err) return callback(err);
                callback(null, { changes: this.changes });
            }
        );
    }

}

module.exports = Comment;
