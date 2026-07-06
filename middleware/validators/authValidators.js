const { body, validationResult } = require("express-validator");

/* ======================================================
   EduShare - Auth Validators
   Uses express-validator to define reusable validation
   chains for registration and login routes.
====================================================== */

/**
 * registerValidators
 * Validates and sanitizes all registration fields.
 */
const registerValidators = [

    body("full_name")
        .trim()
        .notEmpty()
        .withMessage("Full name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters.")
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage("Full name may only contain letters, spaces, hyphens, and apostrophes."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email address is required.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number."),

    body("confirm_password")
        .notEmpty()
        .withMessage("Please confirm your password.")
        .custom((value, { req }) => {

            if (value !== req.body.password) {
                throw new Error("Passwords do not match.");
            }

            return true;

        })

];

/**
 * loginValidators
 * Validates and sanitizes login fields.
 */
const loginValidators = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email address is required.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")

];

/**
 * handleValidationErrors
 * Express middleware that checks validation results.
 * On failure: redirects back with the first error message as a query param.
 * On success: calls next().
 *
 * @param {string} redirectPath - Path to redirect to on validation failure.
 */
function handleValidationErrors(redirectPath) {

    return (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            const firstError = errors.array()[0].msg;

            return res.redirect(
                redirectPath + "?error=" + encodeURIComponent(firstError)
            );

        }

        return next();

    };

}

module.exports = {
    registerValidators,
    loginValidators,
    handleValidationErrors
};
