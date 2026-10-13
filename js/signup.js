
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signUpForm");
    const formMessage = document.getElementById("formMessage");
    const createAccountBtn = document.getElementById("createAccountBtn");

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const acceptTerms = document.getElementById("acceptTerms");

    // Check that the signup form exists
    if (!form) return;

    // Footer year
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // AOS animations
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 40
        });
    }

    // Show / hide password
    document.querySelectorAll(".password-toggle").forEach((button) => {
        button.addEventListener("click", () => {
            const target = document.getElementById(button.dataset.target);

            if (!target) return;

            const showPassword = target.type === "password";
            target.type = showPassword ? "text" : "password";

            button.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );

            button.setAttribute(
                "title",
                showPassword ? "Hide password" : "Show password"
            );

            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-eye", !showPassword);
                icon.classList.toggle("fa-eye-slash", showPassword);
            }
        });
    });

    // Show field validation errors
    function showError(id, message) {
        const error = document.getElementById(id);

        if (error) {
            error.textContent = message;
        }
    }

    // Clear all validation errors
    function clearErrors() {
        [
            "fullNameError",
            "signupEmailError",
            "signupPasswordError",
            "confirmPasswordError",
            "termsError"
        ].forEach((id) => showError(id, ""));
    }

    // Show form message
    function showMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
    }

    // Signup form validation and redirect
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        clearErrors();

        if (formMessage) {
            formMessage.textContent = "";
            formMessage.className = "form-message";
        }

        let isValid = true;

        const nameValue = fullName.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;

        // Full name validation
        if (nameValue.length < 2) {
            showError(
                "fullNameError",
                "Please enter your full name."
            );
            isValid = false;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {
            showError(
                "signupEmailError",
                "Please enter a valid email address."
            );
            isValid = false;
        }

        // Password validation
        if (passwordValue.length < 8) {
            showError(
                "signupPasswordError",
                "Password must contain at least 8 characters."
            );
            isValid = false;
        }

        // Confirm password validation
        if (!confirmValue || confirmValue !== passwordValue) {
            showError(
                "confirmPasswordError",
                "Passwords do not match."
            );
            isValid = false;
        }

        // Terms validation
        if (!acceptTerms.checked) {
            showError(
                "termsError",
                "Please accept the Terms and Privacy Policy."
            );
            isValid = false;
        }

        // Stop if validation fails
        if (!isValid) {
            showMessage(
                "Please correct the errors above.",
                "error"
            );
            return;
        }

        // Disable the button while redirecting
        createAccountBtn.disabled = true;

        const buttonText = createAccountBtn.querySelector("span");

        if (buttonText) {
            buttonText.textContent = "Creating Account...";
        }

        showMessage(
            "Validation successful! Redirecting to login...",
            "success"
        );

        // Redirect to login.html
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });

    // Clear errors while typing
    [
        ["fullName", "fullNameError"],
        ["signupEmail", "signupEmailError"],
        ["signupPassword", "signupPasswordError"],
        ["confirmPassword", "confirmPasswordError"]
    ].forEach(([fieldId, errorId]) => {
        const field = document.getElementById(fieldId);

        if (!field) return;

        field.addEventListener("input", () => {
            showError(errorId, "");

            if (formMessage && formMessage.classList.contains("error")) {
                formMessage.textContent = "";
                formMessage.className = "form-message";
            }
        });
    });

    // Clear terms error when checkbox is selected
    acceptTerms.addEventListener("change", () => {
        showError(
            "termsError",
            acceptTerms.checked ? "" : "Please accept the Terms and Privacy Policy."
        );
    });
});
