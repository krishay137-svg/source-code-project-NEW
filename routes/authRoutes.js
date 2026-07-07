const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const { isGuest, isAuthenticated } = require("../middleware/authMiddleware");
const {
    registerValidators,
    loginValidators,
    handleValidationErrors
} = require("../middleware/validators/authValidators");

/* ---------- Registration ---------- */

router.get(
    "/register",
    isGuest,
    authController.showRegister
);

router.post(
    "/register",
    isGuest,
    /* API endpoints for SPA frontend */
    router.post(
        "/api/auth/register",
        authController.apiRegister
    );

    router.get(
        "/api/auth/me",
        authController.me
    );
    "/api/auth/me",
    authController.me
);

>>>>>>> 1aab8b5 (routes(auth): add /api/auth/me; remove OTP routes)
/* ---------- Login ---------- */

router.get(
    "/login",
    isGuest,
    authController.showLogin
);

router.post(
    "/login",
    isGuest,
    loginValidators,
    handleValidationErrors("/login"),
    authController.login
);

/* ---------- Logout ---------- */

router.get(
    "/logout",
    isAuthenticated,
    authController.logout
);

module.exports = router;