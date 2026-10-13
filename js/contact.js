
/* =====================================================
   LOT SOLUTIONS - COMPLETE CONTACT PAGE JAVASCRIPT
   AOS, Mobile Menu, Contact Form, FAQ, Newsletter
   Redirect: 404.html
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       1. AOS ANIMATIONS
    ===================================================== */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            easing: "ease-out-cubic",
            once: true,
            offset: 65,
            disable: reduceMotion
        });
    }

    /* =====================================================
       2. HEADER SCROLL EFFECT
    ===================================================== */

    const header = document.querySelector(".site-header");

    function updateHeader() {
        if (!header) return;

        header.classList.toggle("scrolled", window.scrollY > 20);
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    /* =====================================================
       3. MOBILE NAVIGATION
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const menuIcon = menuToggle
        ? menuToggle.querySelector("i")
        : null;

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
        menuToggle.setAttribute("aria-expanded", "false");

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

    /* =====================================================
       4. CONTACT FORM VALIDATION
       Valid form -> 404.html
    ===================================================== */

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

        // Check that all required form controls exist.
        const requiredFields = [
            "fullName",
            "email",
            "service",
            "message",
            "consent"
        ];

        const missingField = requiredFields.some(
            (fieldName) => !fields[fieldName]
        );

        if (missingField) {
            if (formStatus) {
                formStatus.textContent =
                    "Form setup error. Please check the form HTML.";
                formStatus.className = "form-status error";
            }

            return false;
        }

        const name = fields.fullName.value.trim();
        const email = fields.email.value.trim();
        const phone = fields.phone
            ? fields.phone.value.trim()
            : "";
        const service = fields.service.value;
        const message = fields.message.value.trim();

        // Name validation
        if (name.length < 2) {
            reportError(
                "fullName",
                "Please enter your name (at least 2 characters)."
            );
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            reportError(
                "email",
                "Please enter a valid email address."
            );
        }

        // Optional phone validation
        if (phone) {
            const digits = phone.replace(/\D/g, "");

            if (digits.length < 7 || digits.length > 15) {
                reportError(
                    "phone",
                    "Please enter a valid phone number."
                );
            }
        }

        // Service validation
        if (!service || !service.trim()) {
            reportError(
                "service",
                "Please select a service."
            );
        }

        // Message validation
        if (message.length < 10) {
            reportError(
                "message",
                "Please describe your project in at least 10 characters."
            );
        }

        // Consent validation
        if (!fields.consent.checked) {
            reportError(
                "consent",
                "Please agree to be contacted about your enquiry."
            );
        }

        // Focus the first invalid field
        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!validateForm()) {
                if (formStatus) {
                    formStatus.textContent =
                        "Please correct the highlighted fields.";
                    formStatus.className = "form-status error";
                }

                return;
            }

            if (formStatus) {
                formStatus.textContent =
                    "Validation successful. Redirecting...";
                formStatus.className = "form-status success";
            }

            // Redirect after successful client-side validation.
            window.location.href = "404.html";
        });

        // Clear individual errors as the user corrects them.
        Object.entries(fields).forEach(([fieldName, field]) => {
            if (!field) return;

            const eventName =
                field.type === "checkbox" ||
                field.tagName === "SELECT"
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

    /* =====================================================
       5. FAQ ACCORDION
       Supports details elements with .faq-item
    ===================================================== */

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

    /* =====================================================
       6. FOOTER CURRENT YEAR
    ===================================================== */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* =====================================================
       7. SMOOTH INTERNAL NAVIGATION
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            let target;

            try {
                target = document.querySelector(href);
            } catch {
                return;
            }

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    /* =====================================================
       8. IMAGE ERROR HANDLING
    ===================================================== */

    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("error", () => {
            img.classList.add("image-unavailable");
            img.alt = "Image could not be loaded";
        }, { once: true });
    });

    /* =====================================================
       9. NEWSLETTER FORM VALIDATION
       Valid email -> 404.html
    ===================================================== */

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");

    if (newsletterForm && newsletterEmail) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = newsletterEmail.value.trim();

            // Reset previous browser validation message.
            newsletterEmail.setCustomValidity("");

            // Empty email validation.
            if (!email) {
                newsletterEmail.setCustomValidity(
                    "Please enter your email address."
                );

                newsletterEmail.reportValidity();
                newsletterEmail.focus();

                return;
            }

            // Email format validation.
            const emailPattern =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!emailPattern.test(email)) {
                newsletterEmail.setCustomValidity(
                    "Please enter a valid email address."
                );

                newsletterEmail.reportValidity();
                newsletterEmail.focus();

                return;
            }

            // Redirect after successful client-side validation.
            window.location.href = "404.html";
        });

        // Clear the browser validation message while typing.
        newsletterEmail.addEventListener("input", () => {
            newsletterEmail.setCustomValidity("");
        });
    }

});
