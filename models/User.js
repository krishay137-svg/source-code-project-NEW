const database = require("../config/database");

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

}

module.exports = User;