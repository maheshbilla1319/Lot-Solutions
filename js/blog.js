
/* =========================================================
   LOT SOLUTIONS BLOG JAVASCRIPT
   AOS, Mobile Navigation, Search, Filters, FAQ, Newsletter
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* 1. AOS SCROLL ANIMATIONS */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 70,
            disable: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        });
    }

    /* 2. HEADER SCROLL EFFECT */

    const header = document.querySelector(".site-header");

    function updateHeader() {
        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );
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
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 796) {
                closeMenu();
            }
        });
    }

    /* 4. ARTICLE SEARCH AND CATEGORY FILTERS */

    const articleSearch = document.getElementById("articleSearch");
    const articleGrid = document.getElementById("articleGrid");
    const articleCards = articleGrid
        ? Array.from(articleGrid.querySelectorAll(".article-card"))
        : [];

    const filterButtons = document.querySelectorAll(".filter-btn");
    const topicLinks = document.querySelectorAll("[data-topic]");
    const emptyState = document.getElementById("emptyState");

    let activeCategory = "All";
    let searchTerm = "";

    function filterArticles() {
        let visibleCount = 0;

        articleCards.forEach((card) => {
            const category = card.dataset.category || "All";
            const text = card.textContent.toLowerCase();
            const matchesCategory =
                activeCategory === "All" ||
                category === activeCategory;

            const matchesSearch = text.includes(searchTerm);
            const isVisible = matchesCategory && matchesSearch;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }

        // Refresh AOS positions after filtering the grid.
        if (typeof AOS !== "undefined") {
            AOS.refresh();
        }
    }

    function setCategory(category) {
        activeCategory = category;

        filterButtons.forEach((button) => {
            const isActive = button.dataset.filter === category;

            button.classList.toggle("active", isActive);

            if (isActive) {
                button.setAttribute("aria-pressed", "true");
            } else {
                button.setAttribute("aria-pressed", "false");
            }
        });

        filterArticles();
    }

    filterButtons.forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            button.classList.contains("active") ? "true" : "false"
        );

        button.addEventListener("click", () => {
            setCategory(button.dataset.filter || "All");
        });
    });

    if (articleSearch) {
        articleSearch.addEventListener("input", () => {
            searchTerm = articleSearch.value.trim().toLowerCase();
            filterArticles();
        });
    }

    topicLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const category = link.dataset.topic;

            if (category) {
                setCategory(category);

                if (articleSearch) {
                    articleSearch.value = "";
                    searchTerm = "";
                }
            }
        });
    });

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

    /* 6. NEWSLETTER FORM VALIDATION */

    const newsletterForm =
        document.getElementById("newsletterForm");

    const newsletterEmail =
        document.getElementById("newsletterEmail");

    const formMessage =
        document.getElementById("formMessage");

    if (newsletterForm && newsletterEmail && formMessage) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = newsletterEmail.value.trim();

            if (!newsletterEmail.checkValidity() || !email) {
                formMessage.textContent =
                    "Please enter a valid email address.";

                newsletterEmail.focus();
                return;
            }

            /*
              Frontend demo only.
              Connect an API or email marketing service
              before collecting real subscriptions.
            */

            formMessage.textContent =
                "Your email looks valid! Connect a subscription service to complete signup.";

            newsletterForm.reset();
        });
    }

    /* 7. IMAGE FALLBACK */

    const images = document.querySelectorAll("img");

    images.forEach((img) => {
        img.addEventListener("error", () => {
            img.classList.add("image-unavailable");
            img.alt = img.alt || "Image unavailable";
        }, { once: true });
    });

    /* 8. DYNAMIC FOOTER YEAR */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* 9. SMOOTH INTERNAL NAVIGATION */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            if (targetId === "#latest") {
                window.setTimeout(() => {
                    if (typeof AOS !== "undefined") {
                        AOS.refresh();
                    }
                }, 300);
            }
        });
    });

    /* 10. INITIALISE ARTICLE FILTER STATE */

    setCategory("All");
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