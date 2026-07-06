/* ======================================================
   EduShare - Authentication Middleware
====================================================== */

/**
 * isAuthenticated
 * Protects routes that require a logged-in user.
 * Redirects unauthenticated requests to /login.
 */
exports.isAuthenticated = (req, res, next) => {

    if (req.session && req.session.user) {

        return next();

    }

    return res.redirect("/login");

};

/**
 * isGuest
 * Prevents authenticated users from accessing guest-only pages
 * (login, register). Redirects logged-in users to the home page.
 */
exports.isGuest = (req, res, next) => {

    if (req.session && req.session.user) {

        return res.redirect("/");

    }

    return next();

};