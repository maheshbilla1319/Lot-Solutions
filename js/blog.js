/* =========================================================
   LOT SOLUTIONS BLOG JAVASCRIPT
   AOS, Mobile Nav, Search, Filters, FAQ,
   Newsletter validation + redirect to 404.html
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const refreshAOS = () => { if (typeof AOS !== "undefined") AOS.refresh(); };

    /* 1. AOS */
    if (typeof AOS !== "undefined") {
        AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 70, disable: reduceMotion });
    }

    /* 2. HEADER SCROLL EFFECT */
    const header = document.querySelector(".site-header");
    const updateHeader = () => header && header.classList.toggle("scrolled", window.scrollY > 20);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    /* 3. MOBILE NAVIGATION */
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const menuIcon = menuToggle ? menuToggle.querySelector("i") : null;

    function setMenu(open) {
        mainNav.classList.toggle("open", open);
        document.body.classList.toggle("menu-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        if (menuIcon) {
            menuIcon.classList.toggle("fa-xmark", open);
            menuIcon.classList.toggle("fa-bars", !open);
        }
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () =>
            setMenu(menuToggle.getAttribute("aria-expanded") !== "true")
        );
        mainNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
        document.addEventListener("click", (e) => {
            if (mainNav.classList.contains("open") && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                setMenu(false);
            }
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mainNav.classList.contains("open")) {
                setMenu(false);
                menuToggle.focus();
            }
        });
        window.addEventListener("resize", () => { if (window.innerWidth > 796) setMenu(false); });
    }

    /* 4. ARTICLE SEARCH + FILTERS */
    const articleSearch = document.getElementById("articleSearch");
    const articleGrid = document.getElementById("articleGrid");
    const emptyState = document.getElementById("emptyState");
    const articleCards = articleGrid ? Array.from(articleGrid.querySelectorAll(".article-card")) : [];
    const filterButtons = document.querySelectorAll(".filter-btn");

    let activeCategory = "All";
    let searchTerm = "";

    function filterArticles() {
        let visible = 0;
        articleCards.forEach((card) => {
            const category = (card.dataset.category || "All").toLowerCase();
            const okCategory = activeCategory === "All" || category === activeCategory.toLowerCase();
            const okSearch = card.textContent.toLowerCase().includes(searchTerm);
            card.hidden = !(okCategory && okSearch);
            if (!card.hidden) visible++;
        });
        if (emptyState) emptyState.hidden = visible > 0;
        refreshAOS();
    }

    function setCategory(category) {
        activeCategory = category || "All";
        filterButtons.forEach((btn) => {
            const on = (btn.dataset.filter || "All").toLowerCase() === activeCategory.toLowerCase();
            btn.classList.toggle("active", on);
            btn.setAttribute("aria-pressed", String(on));
        });
        filterArticles();
    }

    filterButtons.forEach((btn) =>
        btn.addEventListener("click", () => setCategory(btn.dataset.filter || "All"))
    );

    if (articleSearch) {
        articleSearch.addEventListener("input", () => {
            searchTerm = articleSearch.value.trim().toLowerCase();
            filterArticles();
        });
    }

    document.querySelectorAll("[data-topic]").forEach((link) => {
        link.addEventListener("click", () => {
            if (!link.dataset.topic) return;
            searchTerm = "";
            if (articleSearch) articleSearch.value = "";
            setCategory(link.dataset.topic);
        });
    });

    setCategory("All");

    /* 5. FAQ ACCORDION (one open at a time) */
    const faqItems = document.querySelectorAll("details.faq-item");
    faqItems.forEach((item) => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;
            faqItems.forEach((other) => { if (other !== item) other.open = false; });
        });
    });

    /* 6. IMAGE FALLBACK */
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("error", () => {
            img.classList.add("image-unavailable");
            if (!img.alt) img.alt = "Image unavailable";
        }, { once: true });
    });

    /* 7. FOOTER YEAR */
    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();

    /* 8. SMOOTH INTERNAL LINKS */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            const id = link.getAttribute("href");
            if (!id || id === "#") return;
            let target = null;
            try { target = document.querySelector(id); } catch (err) { return; }
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            if (id === "#latest") setTimeout(refreshAOS, reduceMotion ? 0 : 300);
        });
    });

    /* 9. NEWSLETTER FORMS (section + footer) -> redirect to 404.html */
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    [
        ["newsletterForm", "newsletterEmail"],
        ["footerForm", "footerEmail"]
    ].forEach(([formId, inputId]) => {
        const form = document.getElementById(formId);
        const input = document.getElementById(inputId);
        if (!form || !input) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = input.value.trim();

            if (email === "") {
                input.setCustomValidity("Please enter your email address.");
                input.reportValidity();
                return;
            }
            if (!emailPattern.test(email)) {
                input.setCustomValidity("Please enter a valid email address.");
                input.reportValidity();
                return;
            }

            input.setCustomValidity("");
            window.location.href = "404.html";
        });

        input.addEventListener("input", () => input.setCustomValidity(""));
    });
});