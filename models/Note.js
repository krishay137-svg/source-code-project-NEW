const database = require("../config/database");

/* ======================================================
   EduShare - Note Model
   Provides static methods for querying notes.
   Part 5 — Search & Discovery methods.
   (Part 3 — Notes Management will extend this model
    with create, update, delete, and upload methods.)
*/

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

        database.all(query, values, callback);

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

        database.all(query, values, callback);

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

        database.all(query, [parseInt(limit)], callback);

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

        database.all(
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

        database.all(
            "UPDATE notes SET view_count = view_count + 1 WHERE id = ?",
            [parseInt(id)],
            callback
        );

    }



    static create(data, callback) {
        database.run(
            `INSERT INTO notes (user_id, title, subject, description, file_name, file_path, file_size, file_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.user_id, data.title, data.subject, data.description, data.file_name, data.file_path, data.file_size, data.file_type],
            function (err) {
                if (err) return callback(err);
                callback(null, { id: this.lastID });
            }
        );
    }

    static findById(id, callback) {
        database.get(
            `SELECT notes.*, users.full_name AS author_name
             FROM notes JOIN users ON notes.user_id = users.id
             WHERE notes.id = ?`,
            [id],
            (err, row) => {
                if (err) return callback(err);
                callback(null, row || null);
            }
        );
    }

    static findAll({ search, subject, sort, page, limit }, callback) {
        let query = `SELECT notes.*, users.full_name AS author_name FROM notes JOIN users ON notes.user_id = users.id`;
        const params = [];
        const conditions = [];

        if (search) {
            conditions.push("(notes.title LIKE ? OR notes.description LIKE ?)");
            params.push(`%${search}%`, `%${search}%`);
        }

        if (subject && subject !== "All Subjects") {
            conditions.push("notes.subject = ?");
            params.push(subject);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        const sortMap = { newest: "notes.created_at DESC", oldest: "notes.created_at ASC", rating: "notes.rating DESC", downloads: "notes.downloads DESC" };
        query += " ORDER BY " + (sortMap[sort] || "notes.created_at DESC");

        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 50;
        const offset = (p - 1) * l;

        database.all(query, params, (err, rows) => {
            if (err) return callback(err);
            const total = rows.length;
            const paginated = rows.slice(offset, offset + l);
            callback(null, { notes: paginated, total, page: p, limit: l });
        });
    }

    static findByUserId(userId, callback) {
        database.all(
            `SELECT notes.*, users.full_name AS author_name
             FROM notes JOIN users ON notes.user_id = users.id
             WHERE notes.user_id = ? ORDER BY notes.created_at DESC`,
            [userId],
            (err, rows) => {
                if (err) return callback(err);
                callback(null, rows);
            }
        );
    }

    static update(id, userId, data, callback) {
        const fields = [];
        const params = [];

        if (data.title !== undefined) { fields.push("title = ?"); params.push(data.title); }
        if (data.subject !== undefined) { fields.push("subject = ?"); params.push(data.subject); }
        if (data.description !== undefined) { fields.push("description = ?"); params.push(data.description); }
        if (data.file_name !== undefined) { fields.push("file_name = ?"); params.push(data.file_name); }
        if (data.file_path !== undefined) { fields.push("file_path = ?"); params.push(data.file_path); }
        if (data.file_size !== undefined) { fields.push("file_size = ?"); params.push(data.file_size); }
        if (data.file_type !== undefined) { fields.push("file_type = ?"); params.push(data.file_type); }

        if (fields.length === 0) return callback(null, { changes: 0 });

        fields.push("updated_at = datetime('now')");
        params.push(id, userId);

        database.run(
            `UPDATE notes SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
            params,
            function (err) {
                if (err) return callback(err);
                callback(null, { changes: this.changes });
            }
        );
    }

    static delete(id, userId, callback) {
        database.run(
            "DELETE FROM notes WHERE id = ? AND user_id = ?",
            [id, userId],
            function (err) {
                if (err) return callback(err);
                callback(null, { changes: this.changes });
            }
        );
    }

    static incrementDownloads(id, callback) {
        database.run(
            "UPDATE notes SET downloads = downloads + 1 WHERE id = ?",
            [id],
            function (err) {
                if (err) return callback(err);
                callback(null, { changes: this.changes });
            }
        );
    }

    static updateRating(id, callback) {
        database.get(
            "SELECT AVG(rating) AS avg_rating FROM ratings WHERE note_id = ?",
            [id],
            (err, row) => {
                if (err) return callback(err);
                const avg = row && row.avg_rating ? Math.round(row.avg_rating * 10) / 10 : 0;
                database.run("UPDATE notes SET rating = ? WHERE id = ?", [avg, id], (err2) => {
                    if (err2) return callback(err2);
                    callback(null, { rating: avg });
                });
            }
        );
    }

}

module.exports = Note;
