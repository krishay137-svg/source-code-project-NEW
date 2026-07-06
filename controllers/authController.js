const bcrypt = require("bcrypt");

const User = require("../models/User");
const view = require("../utils/view");

/* ======================================================
   Show Pages
====================================================== */

exports.showRegister = (req, res) => {

    view("register", res);

};

exports.showLogin = (req, res) => {

    view("login", res);

};

/* ======================================================
   POST /register
   Validation is handled upstream by registerValidators.
   Controller only handles business logic.
====================================================== */

exports.register = (req, res) => {

    const { full_name, email, password } = req.body;

    /* --- Check email uniqueness --- */

    User.findByEmail(email, (err, results) => {

        if (err) {

            console.error("Database error during registration (findByEmail):", err);

            return res.redirect(
                "/register?error=" + encodeURIComponent("An unexpected error occurred. Please try again.")
            );

        }

        if (results.length > 0) {

            return res.redirect(
                "/register?error=" + encodeURIComponent("An account with this email already exists.")
            );

        }

        /* --- Hash password and create user --- */

        const SALT_ROUNDS = 12;

        bcrypt.hash(password, SALT_ROUNDS, (hashErr, hashedPassword) => {

            if (hashErr) {

                console.error("bcrypt error during registration:", hashErr);

                return res.redirect(
                    "/register?error=" + encodeURIComponent("An unexpected error occurred. Please try again.")
                );

            }

            const userData = {
                full_name: full_name.trim(),
                email,
                password: hashedPassword
            };

            User.create(userData, (createErr) => {

                if (createErr) {

                    console.error("Database error during registration (create):", createErr);

                    return res.redirect(
                        "/register?error=" + encodeURIComponent("An unexpected error occurred. Please try again.")
                    );

                }

                return res.redirect(
                    "/login?success=" + encodeURIComponent("Account created successfully! Please log in.")
                );

            });

        });

    });

};

/* ======================================================
   POST /login
   Validation is handled upstream by loginValidators.
   Controller only handles business logic.
====================================================== */

exports.login = (req, res) => {

    const { email, password } = req.body;

    /* --- Look up user by email --- */

    User.findByEmail(email, (err, results) => {

        if (err) {

            console.error("Database error during login (findByEmail):", err);

            return res.redirect(
                "/login?error=" + encodeURIComponent("An unexpected error occurred. Please try again.")
            );

        }

        if (results.length === 0) {

            /* Generic message — prevents user enumeration */

            return res.redirect(
                "/login?error=" + encodeURIComponent("Invalid email or password.")
            );

        }

        const user = results[0];

        /* --- Compare password with stored hash --- */

        bcrypt.compare(password, user.password, (compareErr, isMatch) => {

            if (compareErr) {

                console.error("bcrypt error during login:", compareErr);

                return res.redirect(
                    "/login?error=" + encodeURIComponent("An unexpected error occurred. Please try again.")
                );

            }

            if (!isMatch) {

                return res.redirect(
                    "/login?error=" + encodeURIComponent("Invalid email or password.")
                );

            }

            /* --- Store user object in session --- */

            req.session.user = {
                id: user.id,
                full_name: user.full_name,
                email: user.email
            };

            req.session.save((saveErr) => {

                if (saveErr) {

                    console.error("Session save error during login:", saveErr);

                    return res.redirect(
                        "/login?error=" + encodeURIComponent("An unexpected error occurred. Please try again.")
                    );

                }

                /* Redirect to home — dashboard implemented in Part 4 */
                return res.redirect("/");

            });

        });

    });

};

/* ======================================================
   GET /logout
====================================================== */

exports.logout = (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            console.error("Session destroy error during logout:", err);

        }

        res.clearCookie("connect.sid");

        return res.redirect("/");

    });

};