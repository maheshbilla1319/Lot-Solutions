
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================
       AOS ANIMATIONS
    ========================================= */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 40,
            disable: prefersReducedMotion
        });
    }

    /* =========================================
       FOOTER YEAR
    ========================================= */

    const footerYear = document.getElementById("footerYear");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    /* =========================================
       PREVIOUS PAGE BUTTON
    ========================================= */

    const goBackButton = document.getElementById("goBackButton");

    goBackButton.addEventListener("click", () => {
        const referrer = document.referrer;

        if (referrer) {
            try {
                const previousURL = new URL(referrer);

                // Only return to pages from the same website.
                if (previousURL.origin === window.location.origin) {
                    window.history.back();
                    return;
                }
            } catch {
                // Use the homepage if the previous URL is invalid.
            }
        }

        window.location.href = "index.html";
    });

    /* =========================================
       WEBSITE SEARCH
    ========================================= */

    const searchForm = document.getElementById("errorSearchForm");
    const searchInput = document.getElementById("errorSearchInput");
    const searchMessage = document.getElementById("searchMessage");

    /*
       Update these paths to match your actual project files.
       This is a small client-side search for known pages,
       not a full website search engine.
    */

    const websitePages = [
        {
            title: "Home",
            keywords: ["home", "homepage", "main", "welcome"],
            url: "index.html"
        },
        {
            title: "About Us",
            keywords: ["about", "company", "team", "story"],
            url: "about.html"
        },
        {
            title: "Services",
            keywords: ["services", "service", "solutions", "development", "design"],
            url: "services.html"
        },
        {
            title: "Contact",
            keywords: ["contact", "support", "help", "email", "message"],
            url: "contact.html"
        },
        {
            title: "Login",
            keywords: ["login", "sign in", "account", "customer login"],
            url: "login.html"
        },
        {
            title: "Customer Dashboard",
            keywords: ["customer dashboard", "customer portal", "my services"],
            url: "customer.html"
        },
        {
            title: "Admin Dashboard",
            keywords: ["admin dashboard", "administrator", "management"],
            url: "admin.html"
        }
    ];

    function normalizeText(value) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^\p{L}\p{N}\s-]/gu, " ")
            .replace(/\s+/g, " ");
    }

    function findPage(query) {
        const normalizedQuery = normalizeText(query);

        if (!normalizedQuery) {
            return null;
        }

        // Prefer an exact page title or keyword match.
        const exactMatch = websitePages.find(page => {
            const title = normalizeText(page.title);

            return title === normalizedQuery ||
                page.keywords.some(keyword =>
                    normalizeText(keyword) === normalizedQuery
                );
        });

        if (exactMatch) {
            return exactMatch;
        }

        // Next, match queries that contain a known keyword.
        return websitePages.find(page => {
            const searchableTerms = [
                page.title,
                ...page.keywords
            ].map(normalizeText);

            return searchableTerms.some(term =>
                normalizedQuery.includes(term) ||
                term.includes(normalizedQuery)
            );
        }) || null;
    }

    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        const query = searchInput.value.trim();

        if (!query) {
            searchMessage.textContent =
                "Please enter a page name or keyword.";

            searchInput.focus();
            return;
        }

        const matchedPage = findPage(query);

        if (matchedPage) {
            searchMessage.textContent =
                `Opening ${matchedPage.title}...`;

            window.location.href = matchedPage.url;
            return;
        }

        searchMessage.textContent =
            "No matching page was found. Try Home, About, Services, Contact, or Login.";
    });

    searchInput.addEventListener("input", () => {
        if (searchMessage.textContent) {
            searchMessage.textContent = "";
        }
    });

    /* =========================================
       QUICK-LINK FEEDBACK
    ========================================= */

    document.querySelectorAll(".quick-link").forEach(link => {
        link.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                link.blur();
            }
        });
    });
});
