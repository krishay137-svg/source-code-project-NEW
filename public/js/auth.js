/* ======================================================
   EduShare - auth.js
   Handles:
     - Client-side form validation (register & login)
     - Password visibility toggle
     - Flash message display from query params
====================================================== */

(function () {

    "use strict";

    /* ---- Helpers ---- */

    function getEl(id) {
        return document.getElementById(id);
    }

    function showFieldError(fieldId, message) {

        var input = getEl(fieldId);
        var errorEl = getEl(fieldId + "-error");

        if (input) {
            input.classList.add("invalid");
        }

        if (errorEl) {
            errorEl.textContent = message;
        }

    }

    function clearFieldError(fieldId) {

        var input = getEl(fieldId);
        var errorEl = getEl(fieldId + "-error");

        if (input) {
            input.classList.remove("invalid");
        }

        if (errorEl) {
            errorEl.textContent = "";
        }

    }

    function showAlert(message, type) {

        var alertEl = getEl("auth-alert");

        if (!alertEl) {
            return;
        }

        alertEl.textContent = message;
        alertEl.className = "auth-alert " + type;

    }

    function clearAllErrors(fields) {

        fields.forEach(function (id) {
            clearFieldError(id);
        });

    }

    /* ---- Flash message from query string ---- */

    function handleFlashMessage() {

        var params = new URLSearchParams(window.location.search);
        var error = params.get("error");
        var success = params.get("success");

        if (error) {
            showAlert(decodeURIComponent(error), "error");
        }

        if (success) {
            showAlert(decodeURIComponent(success), "success");
        }

    }

    /* ---- Password visibility toggle ---- */

    function initPasswordToggles() {

        var toggles = document.querySelectorAll(".toggle-password");

        toggles.forEach(function (btn) {

            btn.addEventListener("click", function () {

                var targetId = btn.getAttribute("data-target");
                var input = getEl(targetId);

                if (!input) {
                    return;
                }

                if (input.type === "password") {
                    input.type = "text";
                    btn.innerHTML = "&#128064;";
                    btn.setAttribute("aria-label", "Hide password");
                } else {
                    input.type = "password";
                    btn.innerHTML = "&#128065;";
                    btn.setAttribute("aria-label", "Show password");
                }

            });

        });

    }

    /* ---- Register form validation ---- */

    function initRegisterForm() {

        var form = getEl("register-form");

        if (!form) {
            return;
        }

        var fields = ["full_name", "email", "password", "confirm_password"];

        form.addEventListener("submit", function (e) {

            clearAllErrors(fields);

            var fullName = getEl("full_name").value.trim();
            var email = getEl("email").value.trim();
            var password = getEl("password").value;
            var confirmPassword = getEl("confirm_password").value;

            var valid = true;

            if (fullName.length < 2) {
                showFieldError("full_name", "Full name must be at least 2 characters.");
                valid = false;
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showFieldError("email", "Please enter a valid email address.");
                valid = false;
            }

            if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
                showFieldError("password", "Password must be at least 8 characters, include one uppercase letter and one number.");
                valid = false;
            }

            if (password !== confirmPassword) {
                showFieldError("confirm_password", "Passwords do not match.");
                valid = false;
            }

            if (!valid) {
                e.preventDefault();
                return;
            }

            var btn = getEl("register-btn");

            if (btn) {
                btn.disabled = true;
                btn.textContent = "Creating account...";
            }

        });

        /* Clear individual field errors on input */

        fields.forEach(function (id) {

            var input = getEl(id);

            if (input) {

                input.addEventListener("input", function () {
                    clearFieldError(id);
                });

            }

        });

    }

    /* ---- Login form validation ---- */

    function initLoginForm() {

        var form = getEl("login-form");

        if (!form) {
            return;
        }

        var fields = ["email", "password"];

        form.addEventListener("submit", function (e) {

            clearAllErrors(fields);

            var email = getEl("email").value.trim();
            var password = getEl("password").value;

            var valid = true;

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showFieldError("email", "Please enter a valid email address.");
                valid = false;
            }

            if (!password) {
                showFieldError("password", "Password is required.");
                valid = false;
            }

            if (!valid) {
                e.preventDefault();
                return;
            }

            var btn = getEl("login-btn");

            if (btn) {
                btn.disabled = true;
                btn.textContent = "Logging in...";
            }

        });

        fields.forEach(function (id) {

            var input = getEl(id);

            if (input) {

                input.addEventListener("input", function () {
                    clearFieldError(id);
                });

            }

        });

    }

    /* ---- Init ---- */

    handleFlashMessage();
    initPasswordToggles();
    initRegisterForm();
    initLoginForm();

}());
