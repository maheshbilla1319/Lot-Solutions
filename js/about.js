
/* =====================================================
   LOT SOLUTIONS - ABOUT PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* 01. AOS SCROLL ANIMATIONS */

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

    function setCounterFinalValue(counter) {
        counter.textContent = Number(counter.dataset.target || 0).toLocaleString();
    }

    function animateCounter(counter) {
        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target)) return;

        if (reduceMotion) {
            setCounterFinalValue(counter);
            return;
        }

        const duration = 1400;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(target * eased);

            counter.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
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
            { threshold: 0.45 }
        );

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    } else {
        counters.forEach(setCounterFinalValue);
    }

    /* 05. IMAGE ERROR FALLBACK */

    document.querySelectorAll("img").forEach(function (img) {
        img.addEventListener("error", function () {
            img.classList.add("image-failed");
            img.setAttribute("aria-hidden", "true");
        });

        if (img.complete && img.naturalWidth === 0) {
            img.classList.add("image-failed");
        }
    });

    /* 06. CURRENT YEAR */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* 07. BACK TO TOP */

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

    /* 08. SMOOTH INTERNAL LINKS */

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

            if (history.replaceState) {
                history.replaceState(null, "", href);
            }
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