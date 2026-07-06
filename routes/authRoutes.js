const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const {

    isGuest

} = require("../middleware/authMiddleware");

/* ---------- Registration ---------- */

router.get(

    "/register",

    isGuest,

    authController.showRegister

);

router.post(

    "/register",

    isGuest,

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

    authController.login

);

/* ---------- Logout ---------- */

router.get(

    "/logout",

    authController.logout

);

module.exports = router;