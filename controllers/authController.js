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
====================================================== */

exports.register = (req, res) => {

    const { full_name, email, password, confirm_password } = req.body;

    /* --- Basic server-side validation --- */

    if (!full_name || !email || !password || !confirm_password) {

        return res.redirect(
            "/register?error=" + encodeURIComponent("All fields are required.")
        );

    }

    if (full_name.trim().length < 2) {

        return res.redirect(
            "/register?error=" + encodeURIComponent("Full name must be at least 2 characters.")
        );

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        return res.redirect(
            "/register?error=" + encodeURIComponent("Please enter a valid email address.")
        );

    }

    if (password.length < 8) {

        return res.redirect(
            "/register?error=" + encodeURIComponent("Password must be at least 8 characters.")
        );

    }

    if (password !== confirm_password) {

        return res.redirect(
            "/register?error=" + encodeURIComponent("Passwords do not match.")
        );

    }

    /* --- Check email uniqueness --- */

    User.findByEmail(email.toLowerCase(), (err, results) => {

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
                email: email.toLowerCase(),
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
====================================================== */

exports.login = (req, res) => {

    const { email, password } = req.body;

    /* --- Basic server-side validation --- */

    if (!email || !password) {

        return res.redirect(
            "/login?error=" + encodeURIComponent("Email and password are required.")
        );

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        return res.redirect(
            "/login?error=" + encodeURIComponent("Please enter a valid email address.")
        );

    }

    /* --- Look up user by email --- */

    User.findByEmail(email.toLowerCase(), (err, results) => {

        if (err) {

            console.error("Database error during login (findByEmail):", err);

            return res.redirect(
                "/login?error=" + encodeURIComponent("An unexpected error occurred. Please try again.")
            );

        }

        if (results.length === 0) {

            /* Use a generic message to avoid user enumeration */

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

            /* --- Store user in session --- */

            req.session.userId = user.id;
            req.session.userName = user.full_name;

            req.session.save((saveErr) => {

                if (saveErr) {

                    console.error("Session save error during login:", saveErr);

                    return res.redirect(
                        "/login?error=" + encodeURIComponent("An unexpected error occurred. Please try again.")
                    );

                }

                /* Redirect to dashboard — implemented in Part 4 */
                return res.redirect("/");

            });

        });

    });

};

/* ======================================================
   GET /logout   — implemented in Commit 4
====================================================== */

exports.logout = (req, res) => {

    res.status(501).send("Logout will be implemented in Commit 4.");

};