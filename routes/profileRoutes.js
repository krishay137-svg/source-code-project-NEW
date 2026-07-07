const express  = require("express");
const router   = express.Router();

const profileController          = require("../controllers/profileController");
const { isAuthenticated }        = require("../middleware/authMiddleware");

/* ======================================================
   Dashboard
====================================================== */
router.get(
    "/api/dashboard",
    isAuthenticated,
    profileController.getDashboard
);

/* ======================================================
   Profile — read & update
====================================================== */
router.get(
    "/api/profile",
    isAuthenticated,
    profileController.getProfile
);

router.put(
    "/api/profile",
    isAuthenticated,
    profileController.updateProfile
);

/* ======================================================
   Avatar upload
====================================================== */
router.post(
    "/api/profile/avatar",
    isAuthenticated,
    profileController.upload.single("avatar"),
    profileController.uploadAvatar
);

module.exports = router;
