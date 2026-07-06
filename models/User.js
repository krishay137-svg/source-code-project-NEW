const database = require("../config/database");

class User {

    static create(userData, callback) {

        const query = `
            INSERT INTO users
            (full_name, email, password)
            VALUES (?, ?, ?)
        `;

        database.query(

            query,

            [
                userData.full_name,
                userData.email,
                userData.password
            ],

            callback

        );

    }

    static findByEmail(email, callback) {

        database.query(

            "SELECT * FROM users WHERE email = ?",

            [email],

            callback

        );

    }

    static findById(id, callback) {

        database.query(

            "SELECT * FROM users WHERE id = ?",

            [id],

            callback

        );

    }

}

module.exports = User;