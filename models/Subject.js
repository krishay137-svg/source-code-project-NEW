const database = require("../config/database");

/* ======================================================
   EduShare - Subject Model
   Provides static methods for querying subjects/categories.
====================================================== */

class Subject {

    /**
     * getAll
     * Retrieves all subjects ordered alphabetically.
     *
     * @param {Function} callback - (err, results)
     */
    static getAll(callback) {

        const query = `
            SELECT id, name, code, description
            FROM   subjects
            ORDER  BY name ASC
        `;

        database.query(query, [], callback);

    }

    /**
     * findById
     * Retrieves a single subject by its primary key.
     *
     * @param {number}   id       - Subject ID
     * @param {Function} callback - (err, results)
     */
    static findById(id, callback) {

        database.query(
            "SELECT id, name, code, description FROM subjects WHERE id = ?",
            [parseInt(id)],
            callback
        );

    }

}

module.exports = Subject;
