const database = require("../config/database");

/* ======================================================
   EduShare - Note Model
   Provides static methods for querying notes.
   Part 5 — Search & Discovery methods.
   (Part 3 — Notes Management will extend this model
    with create, update, delete, and upload methods.)
====================================================== */

class Note {

    /**
     * search
     * Full-text search with keyword, subject, tag, and sort filters.
     * Returns enriched rows including uploader name, subject info,
     * and a comma-separated list of all tags for each note.
     *
     * @param {Object}   params            - Search parameters
     * @param {string}   params.keyword    - Keyword to match title or description
     * @param {number}   params.subject_id - Filter by subject (optional)
     * @param {string}   params.tag        - Filter by exact tag name (optional)
     * @param {string}   params.sort       - newest | oldest | most_downloaded | most_viewed
     * @param {number}   params.page       - Page number (1-indexed)
     * @param {number}   params.limit      - Results per page
     * @param {Function} callback          - (err, results)
     */
    static search(params, callback) {

        const {
            keyword    = "",
            subject_id = null,
            tag        = null,
            sort       = "newest",
            page       = 1,
            limit      = 12
        } = params;

        const offset     = (parseInt(page) - 1) * parseInt(limit);
        const values     = [];
        const conditions = ["n.is_approved = 1"];

        /*
         * When filtering by tag we INNER JOIN to enforce the tag condition,
         * using aliases ntf/tf to avoid collision with the LEFT JOINs
         * (nt/t) used for GROUP_CONCAT of all tags on each note.
         */
        const tagJoin = tag
            ? `INNER JOIN note_tags ntf ON n.id    = ntf.note_id
               INNER JOIN tags      tf  ON ntf.tag_id = tf.id`
            : "";

        if (tag) {
            conditions.push("tf.name = ?");
            values.push(tag.trim());
        }

        if (keyword && keyword.trim()) {
            conditions.push("(n.title LIKE ? OR n.description LIKE ?)");
            const kw = `%${keyword.trim()}%`;
            values.push(kw, kw);
        }

        if (subject_id) {
            conditions.push("n.subject_id = ?");
            values.push(parseInt(subject_id));
        }

        const sortMap = {
            newest:          "n.created_at   DESC",
            oldest:          "n.created_at   ASC",
            most_downloaded: "n.download_count DESC",
            most_viewed:     "n.view_count   DESC"
        };

        const orderBy = sortMap[sort] || sortMap.newest;

        const query = `
            SELECT
                n.id,
                n.title,
                n.description,
                n.file_type,
                n.file_size,
                n.semester,
                n.download_count,
                n.view_count,
                n.created_at,
                u.full_name AS uploader_name,
                s.name      AS subject_name,
                s.code      AS subject_code,
                GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') AS tags
            FROM   notes    n
            LEFT   JOIN users    u  ON n.user_id    = u.id
            LEFT   JOIN subjects s  ON n.subject_id = s.id
            ${tagJoin}
            LEFT   JOIN note_tags nt ON n.id       = nt.note_id
            LEFT   JOIN tags      t  ON nt.tag_id  = t.id
            WHERE  ${conditions.join(" AND ")}
            GROUP  BY
                n.id, n.title, n.description, n.file_type, n.file_size,
                n.semester, n.download_count, n.view_count, n.created_at,
                u.full_name, s.name, s.code
            ORDER  BY ${orderBy}
            LIMIT  ? OFFSET ?
        `;

        values.push(parseInt(limit), offset);

        database.query(query, values, callback);

    }

    /**
     * searchCount
     * Returns the total number of matching notes for pagination.
     *
     * @param {Object}   params            - Same filter params as search()
     * @param {Function} callback          - (err, results)  results[0].total
     */
    static searchCount(params, callback) {

        const {
            keyword    = "",
            subject_id = null,
            tag        = null
        } = params;

        const values     = [];
        const conditions = ["n.is_approved = 1"];

        const tagJoin = tag
            ? `INNER JOIN note_tags ntf ON n.id    = ntf.note_id
               INNER JOIN tags      tf  ON ntf.tag_id = tf.id`
            : "";

        if (tag) {
            conditions.push("tf.name = ?");
            values.push(tag.trim());
        }

        if (keyword && keyword.trim()) {
            conditions.push("(n.title LIKE ? OR n.description LIKE ?)");
            const kw = `%${keyword.trim()}%`;
            values.push(kw, kw);
        }

        if (subject_id) {
            conditions.push("n.subject_id = ?");
            values.push(parseInt(subject_id));
        }

        const query = `
            SELECT COUNT(DISTINCT n.id) AS total
            FROM   notes n
            ${tagJoin}
            WHERE  ${conditions.join(" AND ")}
        `;

        database.query(query, values, callback);

    }

    /**
     * findById
     * Retrieves a single approved note by ID with full details.
     *
     * @param {number}   id       - Note ID
     * @param {Function} callback - (err, results)
     */
    static findById(id, callback) {

        const query = `
            SELECT
                n.*,
                u.full_name AS uploader_name,
                s.name      AS subject_name,
                s.code      AS subject_code,
                GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') AS tags
            FROM   notes    n
            LEFT   JOIN users    u  ON n.user_id    = u.id
            LEFT   JOIN subjects s  ON n.subject_id = s.id
            LEFT   JOIN note_tags nt ON n.id        = nt.note_id
            LEFT   JOIN tags      t  ON nt.tag_id   = t.id
            WHERE  n.id = ? AND n.is_approved = 1
            GROUP  BY n.id
        `;

        database.query(query, [parseInt(id)], callback);

    }

    /**
     * getTrending
     * Returns the most-downloaded approved notes.
     *
     * @param {number}   limit    - Maximum rows to return
     * @param {Function} callback - (err, results)
     */
    static getTrending(limit, callback) {

        const query = `
            SELECT
                n.id,
                n.title,
                n.file_type,
                n.download_count,
                n.view_count,
                n.created_at,
                u.full_name AS uploader_name,
                s.name      AS subject_name,
                s.code      AS subject_code
            FROM   notes    n
            LEFT   JOIN users    u  ON n.user_id    = u.id
            LEFT   JOIN subjects s  ON n.subject_id = s.id
            WHERE  n.is_approved = 1
            ORDER  BY n.download_count DESC, n.view_count DESC
            LIMIT  ?
        `;

        database.query(query, [parseInt(limit)], callback);

    }

    /**
     * getRelated
     * Returns approved notes in the same subject, excluding the current note.
     *
     * @param {number}   noteId    - The note to exclude
     * @param {number}   subjectId - Subject to match
     * @param {number}   limit     - Maximum rows to return
     * @param {Function} callback  - (err, results)
     */
    static getRelated(noteId, subjectId, limit, callback) {

        const query = `
            SELECT
                n.id,
                n.title,
                n.file_type,
                n.download_count,
                u.full_name AS uploader_name,
                s.name      AS subject_name
            FROM   notes    n
            LEFT   JOIN users    u  ON n.user_id    = u.id
            LEFT   JOIN subjects s  ON n.subject_id = s.id
            WHERE  n.is_approved = 1
              AND  n.id         != ?
              AND  n.subject_id  = ?
            ORDER  BY n.download_count DESC
            LIMIT  ?
        `;

        database.query(
            query,
            [parseInt(noteId), parseInt(subjectId), parseInt(limit)],
            callback
        );

    }

    /**
     * incrementViews
     * Increments the view_count of a note by 1.
     *
     * @param {number}   id       - Note ID
     * @param {Function} callback - (err, results)
     */
    static incrementViews(id, callback) {

        database.query(
            "UPDATE notes SET view_count = view_count + 1 WHERE id = ?",
            [parseInt(id)],
            callback
        );

    }

}

module.exports = Note;
