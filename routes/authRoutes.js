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
    registerValidators,
    handleValidationErrors("/register"),
    authController.register
);

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