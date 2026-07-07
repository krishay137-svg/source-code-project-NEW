const database = require("../config/database");

/* ======================================================
   EduShare - Rating Model
   Community Features — Part 6
   Allows authenticated users to rate notes (1–5 stars).
   One rating per user per note; updates if already rated.
*/

class Rating {

    /**
     * upsert
     * Insert or update a user's rating for a note.
     *
     * @param {number}   noteId   - Target note
     * @param {number}   userId   - Authenticated user
     * @param {number}   value    - Star value (1–5)
     * @param {Function} callback - (err, { avgRating, totalRatings })
     */
    static upsert(noteId, userId, value, callback) {

        // Check if rating already exists
        database.get(
            "SELECT id FROM ratings WHERE note_id = ? AND user_id = ?",
            [noteId, userId],
            (err, existing) => {
                if (err) return callback(err);

                const upsertFn = existing
                    ? (cb) => database.run(
                        "UPDATE ratings SET rating = ?, updated_at = datetime('now') WHERE note_id = ? AND user_id = ?",
                        [value, noteId, userId],
                        cb
                    )
                    : (cb) => database.run(
                        "INSERT INTO ratings (note_id, user_id, rating) VALUES (?, ?, ?)",
                        [noteId, userId, value],
                        cb
                    );

                upsertFn((err2) => {
                    if (err2) return callback(err2);

                    // Recalculate average
                    database.get(
                        "SELECT AVG(rating) AS avg, COUNT(*) AS total FROM ratings WHERE note_id = ?",
                        [noteId],
                        (err3, row) => {
                            if (err3) return callback(err3);
                            const avg   = row ? Math.round((row.avg || 0) * 10) / 10 : 0;
                            const total = row ? row.total : 0;

                            // Keep notes.rating column in sync
                            database.run(
                                "UPDATE notes SET rating = ? WHERE id = ?",
                                [avg, noteId],
                                (err4) => {
                                    if (err4) return callback(err4);
                                    callback(null, { avgRating: avg, totalRatings: total });
                                }
                            );
                        }
                    );
                });
            }
        );
    }

    /**
     * getForNote
     * Returns the average rating and total count for a note.
     *
     * @param {number}   noteId   - Target note
     * @param {Function} callback - (err, { avgRating, totalRatings })
     */
    static getForNote(noteId, callback) {
        database.get(
            "SELECT AVG(rating) AS avg, COUNT(*) AS total FROM ratings WHERE note_id = ?",
            [noteId],
            (err, row) => {
                if (err) return callback(err);
                callback(null, {
                    avgRating:    row ? Math.round((row.avg || 0) * 10) / 10 : 0,
                    totalRatings: row ? row.total : 0
                });
            }
        );
    }

    /**
     * getUserRating
     * Returns the rating a specific user gave to a note.
     *
     * @param {number}   noteId   - Target note
     * @param {number}   userId   - Authenticated user
     * @param {Function} callback - (err, rating | null)
     */
    static getUserRating(noteId, userId, callback) {
        database.get(
            "SELECT rating FROM ratings WHERE note_id = ? AND user_id = ?",
            [noteId, userId],
            (err, row) => {
                if (err) return callback(err);
                callback(null, row ? row.rating : null);
            }
        );
    }

}

module.exports = Rating;
