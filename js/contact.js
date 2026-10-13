
/* =====================================================
   LOT SOLUTIONS - CONTACT PAGE JAVASCRIPT
   AOS, Mobile Menu, Form Validation, FAQ and Navigation
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* 1. AOS ANIMATIONS */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            easing: "ease-out-cubic",
            once: true,
            offset: 65,
            disable: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        });
    }

    /* 2. HEADER SCROLL EFFECT */

    const header = document.querySelector(".site-header");

    function updateHeader() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 20);
        }
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    /* 3. MOBILE NAVIGATION */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const menuIcon = menuToggle?.querySelector("i");

    function closeMenu() {
        if (!menuToggle || !mainNav) return;

        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        document.body.classList.remove("menu-open");

        if (menuIcon) {
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
                return;
            }

            mainNav.classList.add("open");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation");
            document.body.classList.add("menu-open");

            if (menuIcon) {
                menuIcon.classList.remove("fa-bars");
                menuIcon.classList.add("fa-xmark");
            }
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (
                mainNav.classList.contains("open") &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 796) {
                closeMenu();
            }
        });
    }

    /* 4. CONTACT FORM VALIDATION */

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    const fields = {
        fullName: document.getElementById("fullName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        service: document.getElementById("service"),
        message: document.getElementById("message"),
        consent: document.getElementById("consent")
    };

    const errorElements = {
        fullName: document.getElementById("nameError"),
        email: document.getElementById("emailError"),
        phone: document.getElementById("phoneError"),
        service: document.getElementById("serviceError"),
        message: document.getElementById("messageError"),
        consent: document.getElementById("consentError")
    };

    function setError(fieldName, message) {
        const field = fields[fieldName];
        const errorElement = errorElements[fieldName];

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (field) {
            field.classList.toggle("invalid", Boolean(message));

            if (fieldName !== "consent") {
                field.setAttribute(
                    "aria-invalid",
                    message ? "true" : "false"
                );
            }
        }
    }

    function clearErrors() {
        Object.keys(errorElements).forEach((fieldName) => {
            setError(fieldName, "");
        });

        if (formStatus) {
            formStatus.textContent = "";
            formStatus.className = "form-status";
        }
    }

    function validateForm() {
        clearErrors();

        let isValid = true;
        let firstInvalidField = null;

        function reportError(fieldName, message) {
            setError(fieldName, message);
            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = fields[fieldName];
            }
        }

        const name = fields.fullName.value.trim();
        const email = fields.email.value.trim();
        const phone = fields.phone.value.trim();
        const service = fields.service.value;
        const message = fields.message.value.trim();

        if (name.length < 2) {
            reportError(
                "fullName",
                "Please enter your name (at least 2 characters)."
            );
        }

        if (
            !email ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            reportError(
                "email",
                "Please enter a valid email address."
            );
        }

        if (phone) {
            const digits = phone.replace(/\D/g, "");

            if (digits.length < 7 || digits.length > 15) {
                reportError(
                    "phone",
                    "Please enter a valid phone number."
                );
            }
        }

        if (!service) {
            reportError(
                "service",
                "Please select a service."
            );
        }

        if (message.length < 10) {
            reportError(
                "message",
                "Please describe your project in at least 10 characters."
            );
        }

        if (!fields.consent.checked) {
            reportError(
                "consent",
                "Please agree to be contacted about your enquiry."
            );
        }

        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!validateForm()) {
                formStatus.textContent =
                    "Please correct the highlighted fields.";
                formStatus.className = "form-status error";
                return;
            }

            /*
              The form is validated locally only.
              Connect your backend/API or form service here
              to securely deliver and store submissions.
            */

            formStatus.textContent =
                "Validation successful. Connect a backend or form service to submit your enquiry.";
            formStatus.className = "form-status success";
        });

        Object.entries(fields).forEach(([fieldName, field]) => {
            if (!field) return;

            const eventName =
                field.type === "checkbox" || field.tagName === "SELECT"
                    ? "change"
                    : "input";

            field.addEventListener(eventName, () => {
                setError(fieldName, "");

                if (formStatus) {
                    formStatus.textContent = "";
                    formStatus.className = "form-status";
                }
            });
        });
    }

    /* 5. FAQ ACCORDION */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;

            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.open = false;
                }
            });
        });
    });

    /* 6. FOOTER YEAR */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* 7. SMOOTH INTERNAL LINKS */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    /* 8. IMAGE ERROR HANDLING */

    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("error", () => {
            img.classList.add("image-unavailable");
            img.alt = "Image could not be loaded";
        }, { once: true });
    });

});
/* =========================================
   NEWSLETTER FORM VALIDATION & REDIRECT
========================================= */

"use strict";

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");

if (newsletterForm && newsletterEmail) {

    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = newsletterEmail.value.trim();

        // Empty email validation
        if (email === "") {
            newsletterEmail.setCustomValidity(
                "Please enter your email address."
            );
            newsletterEmail.reportValidity();
            return;
        }

        // Email format validation
        const emailPattern =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            newsletterEmail.setCustomValidity(
                "Please enter a valid email address."
            );
            newsletterEmail.reportValidity();
            return;
        }

        // Valid email - redirect to 404.html
        newsletterEmail.setCustomValidity("");

        window.location.href = "404.html";

    });

    // Clear validation message when the user types
    newsletterEmail.addEventListener("input", function () {
        newsletterEmail.setCustomValidity("");
    });

}