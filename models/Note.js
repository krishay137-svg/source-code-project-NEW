const database = require("../config/database");

class Note {

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
