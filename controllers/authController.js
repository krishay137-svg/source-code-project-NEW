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

<<<<<<< HEAD
=======

>>>>>>> 64382b6 (server(auth): auto-login on register, include created_at in session)
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
<<<<<<< HEAD
=======
   POST /api/auth/register (JSON API)
====================================================== */

exports.apiRegister = (req, res) => {

    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    User.findByEmail(email, (err, results) => {

        if (err) {
            console.error("Database error during api registration:", err);
            return res.status(500).json({ error: "An unexpected error occurred." });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "An account with this email already exists." });
        }

        const SALT_ROUNDS = 12;

        bcrypt.hash(password, SALT_ROUNDS, (hashErr, hashedPassword) => {

            if (hashErr) {
                console.error("bcrypt error during api registration:", hashErr);
                return res.status(500).json({ error: "An unexpected error occurred." });
            }

            const userData = {
                full_name: full_name.trim(),
                email,
                password: hashedPassword
            };

            User.create(userData, (createErr) => {

                if (createErr) {
                    console.error("Database error during api registration (create):", createErr);
                    return res.status(500).json({ error: "An unexpected error occurred." });
                }

                // Fetch created user and establish session so frontend sees logged-in state
                User.findByEmail(email, (findErr, rows) => {
                    if (findErr) {
                        console.error('Error fetching created user:', findErr);
                        return res.status(201).json({ message: 'Account created successfully!' });
                    }

                    const user = rows && rows[0];
                    if (user && req.session) {
                        req.session.user = {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            created_at: user.created_at
                        };
                        req.session.save((saveErr) => {
                            if (saveErr) console.error('Session save error after registration:', saveErr);
                            return res.status(201).json({ message: 'Account created successfully!', user: req.session.user });
                        });
                    } else {
                        return res.status(201).json({ message: 'Account created successfully!' });
                    }
                });

            });

        });

    });

};

/* ======================================================
>>>>>>> 64382b6 (server(auth): auto-login on register, include created_at in session)
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

<<<<<<< HEAD
};
=======
};

/* ======================================================
   GET /api/auth/me
   Returns current logged-in user from session (JSON)
====================================================== */

exports.me = (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ user: req.session.user });
    }
    return res.status(401).json({ error: 'Not authenticated' });
};

/* ======================================================
   POST /send-otp
   Expects JSON: { email }
   Sends OTP to the provided email and stores it in session
====================================================== */

>>>>>>> 64382b6 (server(auth): auto-login on register, include created_at in session)
