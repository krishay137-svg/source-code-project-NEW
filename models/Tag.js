const database = require("../config/database");

/* ======================================================
   EduShare - Tag Model
   Provides static methods for querying tags.
====================================================== */

class Tag {

    /**
     * getAll
     * Retrieves all tags ordered alphabetically.
     *
     * @param {Function} callback - (err, results)
     */
    static getAll(callback) {

        database.all(
            "SELECT id, name FROM tags ORDER BY name ASC",
            [],
            callback
        );

    }

    /**
     * findByNoteId
     * Retrieves all tags associated with a given note.
     *
     * @param {number}   noteId   - Note ID
     * @param {Function} callback - (err, results)
     */
    static findByNoteId(noteId, callback) {

        const query = `
            SELECT t.id, t.name
            FROM   tags       t
            INNER  JOIN note_tags nt ON t.id = nt.tag_id
            WHERE  nt.note_id = ?
            ORDER  BY t.name ASC
        `;

        database.all(query, [parseInt(noteId)], callback);

    }

    /**
     * getPopular
     * Retrieves the most-used tags across all approved notes.
     *
     * @param {number}   limit    - Maximum number of tags to return
     * @param {Function} callback - (err, results)
     */
    static getPopular(limit, callback) {

        const query = `
            SELECT   t.id, t.name, COUNT(nt.note_id) AS usage_count
            FROM     tags       t
            INNER    JOIN note_tags nt ON t.id     = nt.tag_id
            INNER    JOIN notes    n  ON nt.note_id = n.id
            WHERE    n.is_approved = 1
            GROUP    BY t.id, t.name
            ORDER    BY usage_count DESC
            LIMIT    ?
        `;

        database.all(query, [parseInt(limit)], callback);

    }

}

module.exports = Tag;
