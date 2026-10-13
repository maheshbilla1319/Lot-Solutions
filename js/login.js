
/* =====================================================
   LOT SOLUTIONS — LOGIN JAVASCRIPT
   Features:
   1. AOS Initialization
   2. Email Validation
   3. Password Validation
   4. Show / Hide Password
   5. Form Status Messages
   6. Admin / Customer Redirect
   7. Logout Redirect
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================
       AOS INITIALIZATION
    ========================================= */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            easing: "ease-out-cubic",
            once: true,
            offset: 45,
            disable: reduceMotion
        });
    }

    /* =========================================
       ELEMENTS
    ========================================= */

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const userRole = document.getElementById("userRole");
    const togglePassword = document.getElementById("togglePassword");
    const loginButton = document.getElementById("loginButton");
    const formStatus = document.getElementById("formStatus");
    const currentYear = document.getElementById("currentYear");
    const logoutButton = document.getElementById("logoutButton");

    /* =========================================
       CURRENT YEAR
    ========================================= */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* =========================================
       PASSWORD SHOW / HIDE
    ========================================= */

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const isHidden = passwordInput.type === "password";

            passwordInput.type = isHidden ? "text" : "password";

            togglePassword.innerHTML = isHidden
                ? '<i class="fa-regular fa-eye-slash" aria-hidden="true"></i>'
                : '<i class="fa-regular fa-eye" aria-hidden="true"></i>';

            const message = isHidden
                ? "Hide password"
                : "Show password";

            togglePassword.setAttribute("aria-label", message);
            togglePassword.setAttribute("title", message);
        });
    }

    /* =========================================
       FORM STATUS
    ========================================= */

    function showStatus(message, type = "error") {
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.className = `form-status show ${type}`;
        formStatus.setAttribute("role", "alert");
        formStatus.setAttribute("aria-live", "polite");
    }

    function clearStatus() {
        if (!formStatus) return;

        formStatus.textContent = "";
        formStatus.className = "form-status";
    }

    /* =========================================
       FIELD ERROR HANDLING
    ========================================= */

    function setError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);

        input.classList.toggle("invalid", Boolean(message));

        if (message) {
            input.setAttribute("aria-invalid", "true");
        } else {
            input.removeAttribute("aria-invalid");
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    /* =========================================
       EMAIL VALIDATION
    ========================================= */

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateEmail() {
        const email = emailInput.value.trim();

        if (!email) {
            setError(
                emailInput,
                "emailError",
                "Email address is required."
            );

            return false;
        }

        if (!isValidEmail(email)) {
            setError(
                emailInput,
                "emailError",
                "Please enter a valid email address."
            );

            return false;
        }

        setError(emailInput, "emailError", "");
        return true;
    }

    /* =========================================
       PASSWORD VALIDATION
    ========================================= */

    function validatePassword() {
        const password = passwordInput.value;

        if (!password) {
            setError(
                passwordInput,
                "passwordError",
                "Password is required."
            );

            return false;
        }

        if (password.length < 8) {
            setError(
                passwordInput,
                "passwordError",
                "Password must contain at least 8 characters."
            );

            return false;
        }

        setError(passwordInput, "passwordError", "");
        return true;
    }

    /* =========================================
       CHECK REQUIRED LOGIN ELEMENTS
    ========================================= */

    if (loginForm) {
        if (
            !emailInput ||
            !passwordInput ||
            !userRole ||
            !loginButton ||
            !formStatus
        ) {
            console.error(
                "Login form is missing one or more required elements."
            );
        } else {

            /* =====================================
               CLEAR ERRORS WHILE TYPING
            ===================================== */

            emailInput.addEventListener("input", () => {
                clearStatus();
                validateEmail();
            });

            passwordInput.addEventListener("input", () => {
                clearStatus();
                validatePassword();
            });

            userRole.addEventListener("change", clearStatus);

            /* =====================================
               LOGIN FORM SUBMISSION
            ===================================== */

            loginForm.addEventListener("submit", (event) => {
                event.preventDefault();
                clearStatus();

                const emailValid = validateEmail();
                const passwordValid = validatePassword();

                if (!emailValid || !passwordValid) {
                    showStatus(
                        "Please correct the highlighted fields and try again."
                    );

                    const invalidField =
                        loginForm.querySelector(".invalid");

                    if (invalidField) {
                        invalidField.focus();
                    }

                    return;
                }

                const role = userRole.value;

                if (role !== "admin" && role !== "customer") {
                    showStatus("Please select a valid user role.");
                    userRole.focus();
                    return;
                }

                /* =================================
                   DEMO LOGIN — NOT REAL AUTHENTICATION
                ================================= */

                showStatus(
                    "Validation successful. Redirecting...",
                    "success"
                );

                loginButton.disabled = true;
                loginButton.setAttribute("aria-busy", "true");

                if (role === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "customer.html";
                }
            });
        }
    }

    /* =========================================
       LOGOUT REDIRECT
    ========================================= */

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
});
