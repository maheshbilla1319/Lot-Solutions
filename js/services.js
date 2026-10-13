
/* ======================================================
   LOT SOLUTIONS - SERVICES PAGE JAVASCRIPT
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* 01. AOS ANIMATIONS */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 65,
            disable: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        });
    }

    /* 02. MOBILE NAVIGATION */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    function closeMenu() {
        if (!menuToggle || !mainNav) return;

        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        document.body.classList.remove("menu-open");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            document.body.classList.toggle("menu-open", isOpen);

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars", !isOpen);
                icon.classList.toggle("fa-xmark", isOpen);
            }
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", function (event) {
            if (
                mainNav.classList.contains("open") &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 796) {
                closeMenu();
            }
        });
    }

    /* 03. HEADER SCROLL EFFECT */

    const siteHeader = document.getElementById("siteHeader");

    function updateHeader() {
        if (siteHeader) {
            siteHeader.classList.toggle("scrolled", window.scrollY > 20);
        }
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    /* 04. ANIMATED COUNTERS */

    const counters = document.querySelectorAll(".counter");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function animateCounter(counter) {
        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target)) return;

        if (reduceMotion) {
            counter.textContent = target.toLocaleString();
            return;
        }

        const duration = 1300;
        const startTime = performance.now();

        function update(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easedProgress = 1 - Math.pow(1 - progress, 4);

            counter.textContent = Math.round(
                target * easedProgress
            ).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    } else {
        counters.forEach(function (counter) {
            counter.textContent = Number(
                counter.dataset.target || 0
            ).toLocaleString();
        });
    }

    /* 05. FAQ ACCORDION */

    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(function (question) {
        question.addEventListener("click", function () {
            const isExpanded =
                question.getAttribute("aria-expanded") === "true";

            const answer = question.closest(".faq-item")
                .querySelector(".faq-answer");

            // Close all other FAQ items.
            faqQuestions.forEach(function (otherQuestion) {
                otherQuestion.setAttribute("aria-expanded", "false");

                const otherAnswer = otherQuestion
                    .closest(".faq-item")
                    .querySelector(".faq-answer");

                if (otherAnswer) {
                    otherAnswer.hidden = true;
                }
            });

            // Toggle the selected item.
            if (!isExpanded && answer) {
                question.setAttribute("aria-expanded", "true");
                answer.hidden = false;
            }
        });
    });

    /* 06. IMAGE ERROR HANDLING */

    document.querySelectorAll("img").forEach(function (image) {
        function handleImageError() {
            image.classList.add("image-failed");

            const imageContainer = image.closest(".service-image");

            if (imageContainer) {
                imageContainer.classList.add("image-missing");
            }
        }

        image.addEventListener("error", handleImageError);

        if (image.complete && image.naturalWidth === 0) {
            handleImageError();
        }
    });

    /* 07. FOOTER YEAR */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* 08. BACK TO TOP */

    const backTop = document.querySelector(".back-top");

    if (backTop) {
        backTop.addEventListener("click", function (event) {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });
    }

    /* 09. SMOOTH INTERNAL NAVIGATION */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        });
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
