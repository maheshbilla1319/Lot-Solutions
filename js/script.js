
/* =====================================================
   LOT SOLUTIONS — COMPLETE MAIN JAVASCRIPT
===================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       01. AOS INITIALIZATION
    ================================================= */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            easing: "ease-out-cubic",
            once: true,
            offset: 80
        });
    }


    /* =================================================
       02. ELEMENT REFERENCES
    ================================================= */

    const header = document.getElementById("header");
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");


    /* =================================================
       03. MOBILE NAVIGATION
    ================================================= */

    function closeMobileNav() {
        if (!menuBtn || !nav) return;

        nav.classList.remove("open");

        menuBtn.setAttribute("aria-expanded", "false");

        const icon = menuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }

    if (menuBtn && nav) {

        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("open");

            menuBtn.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            const icon = menuBtn.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars", !isOpen);
                icon.classList.toggle("fa-xmark", isOpen);
            }

        });

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", closeMobileNav);

        });

        document.addEventListener("click", event => {

            if (
                nav.classList.contains("open") &&
                !nav.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                closeMobileNav();
            }

        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMobileNav();
            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 900) {
                closeMobileNav();
            }

        });

    }


    /* =================================================
       04. HEADER SCROLL EFFECT
    ================================================= */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* =================================================
       05. ACTIVE NAVIGATION
    ================================================= */

    const sections = document.querySelectorAll("section[id]");

    const navLinks = document.querySelectorAll(
        '.nav a[href^="#"]'
    );

    function updateActiveNav() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop =
                section.getBoundingClientRect().top +
                window.scrollY;

            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                window.scrollY + 150 >= sectionTop &&
                window.scrollY + 150 < sectionBottom
            ) {
                currentSection = section.id;
            }

        });

        navLinks.forEach(link => {

            const isActive =
                link.getAttribute("href") ===
                `#${currentSection}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }

        });

    }

    window.addEventListener("scroll", updateActiveNav, {
        passive: true
    });

    window.addEventListener("resize", updateActiveNav);

    updateActiveNav();


    /* =================================================
       06. SMOOTH ANCHOR SCROLL
    ================================================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });

        });

    });


    /* =================================================
       07. COUNTER ANIMATION
    ================================================= */

    const counters = document.querySelectorAll(".counter");
    const statsSection = document.querySelector(".stats");

    let countersStarted = false;

    function animateCounters() {

        if (countersStarted || !statsSection) return;

        const sectionTop =
            statsSection.getBoundingClientRect().top;

        if (sectionTop >= window.innerHeight - 100) return;

        countersStarted = true;

        counters.forEach(counter => {

            const target = Number(counter.dataset.target);

            if (!Number.isFinite(target)) return;

            const duration = 1600;
            const startTime = performance.now();

            function updateCounter(currentTime) {

                const progress = Math.min(
                    (currentTime - startTime) / duration,
                    1
                );

                const easedProgress =
                    1 - Math.pow(1 - progress, 3);

                const currentValue = Math.floor(
                    easedProgress * target
                );

                counter.textContent =
                    currentValue.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent =
                        target.toLocaleString();
                }

            }

            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {
                counter.textContent = target.toLocaleString();
            } else {
                requestAnimationFrame(updateCounter);
            }

        });

    }

    window.addEventListener("scroll", animateCounters, {
        passive: true
    });

    animateCounters();


    /* =================================================
       08. TESTIMONIAL SLIDER
    ================================================= */

    const testimonials =
        document.querySelectorAll(".testimonial");

    const testimonialDots =
        document.querySelectorAll(".testimonial-dots .dot");

    let testimonialIndex = 0;
    let testimonialTimer = null;

    function showTestimonial(index) {

        if (!testimonials.length) return;

        testimonialIndex =
            (index + testimonials.length) % testimonials.length;

        testimonials.forEach((item, i) => {

            const active = i === testimonialIndex;

            item.classList.toggle("active", active);
            item.hidden = !active;

        });

        testimonialDots.forEach((dot, i) => {

            const active = i === testimonialIndex;

            dot.classList.toggle("active", active);

            dot.setAttribute(
                "aria-pressed",
                String(active)
            );

        });

    }

    function stopTestimonialAutoplay() {

        if (testimonialTimer !== null) {
            clearInterval(testimonialTimer);
            testimonialTimer = null;
        }

    }

    function startTestimonialAutoplay() {

        stopTestimonialAutoplay();

        if (
            testimonials.length < 2 ||
            document.hidden ||
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            return;
        }

        testimonialTimer = setInterval(() => {
            showTestimonial(testimonialIndex + 1);
        }, 5000);

    }

    testimonialDots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            showTestimonial(index);
            startTestimonialAutoplay();

        });

    });

    const testimonialSlider =
        document.querySelector(".testimonial-slider");

    if (testimonialSlider) {

        testimonialSlider.addEventListener(
            "mouseenter",
            stopTestimonialAutoplay
        );

        testimonialSlider.addEventListener(
            "mouseleave",
            startTestimonialAutoplay
        );

        testimonialSlider.addEventListener(
            "focusin",
            stopTestimonialAutoplay
        );

        testimonialSlider.addEventListener(
            "focusout",
            event => {
                if (
                    !testimonialSlider.contains(event.relatedTarget)
                ) {
                    startTestimonialAutoplay();
                }
            }
        );

    }

    if (testimonials.length) {
        showTestimonial(0);
        startTestimonialAutoplay();
    }


    /* =================================================
       09. FAQ ACCORDION
    ================================================= */

    const faqItems = document.querySelectorAll(".faq-item");

    function closeFaq(item) {

        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!button || !answer) return;

        item.classList.remove("active");

        button.setAttribute("aria-expanded", "false");

        answer.style.maxHeight =
            answer.scrollHeight + "px";

        requestAnimationFrame(() => {

            answer.style.maxHeight = "0px";

        });

        const hideAnswer = event => {

            if (
                event.propertyName === "max-height" &&
                !item.classList.contains("active")
            ) {
                answer.hidden = true;
            }

        };

        answer.addEventListener(
            "transitionend",
            hideAnswer,
            { once: true }
        );

    }

    function openFaq(item) {

        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!button || !answer) return;

        item.classList.add("active");

        button.setAttribute("aria-expanded", "true");

        answer.hidden = false;
        answer.style.maxHeight = "0px";

        requestAnimationFrame(() => {

            answer.style.maxHeight =
                answer.scrollHeight + "px";

        });

    }

    faqItems.forEach(item => {

        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!button || !answer) return;

        if (item.classList.contains("active")) {

            button.setAttribute("aria-expanded", "true");

            answer.hidden = false;

            answer.style.maxHeight =
                answer.scrollHeight + "px";

        } else {

            button.setAttribute("aria-expanded", "false");

            answer.hidden = true;
            answer.style.maxHeight = "0px";

        }

        button.addEventListener("click", () => {

            const isOpen = item.classList.contains("active");

            faqItems.forEach(otherItem => {

                if (
                    otherItem !== item &&
                    otherItem.classList.contains("active")
                ) {
                    closeFaq(otherItem);
                }

            });

            if (isOpen) {
                closeFaq(item);
            } else {
                openFaq(item);
            }

        });

    });

    window.addEventListener("resize", () => {

        faqItems.forEach(item => {

            if (!item.classList.contains("active")) return;

            const answer = item.querySelector(".faq-answer");

            if (answer) {
                answer.style.maxHeight =
                    answer.scrollHeight + "px";
            }

        });

    });


    /* =================================================
       10. LOT SOLUTIONS — HERO BANNER SLIDER
    ================================================= */

    const bannerSlider = document.querySelector(".lot-banner");

    if (bannerSlider) {

        const slides = Array.from(
            bannerSlider.querySelectorAll(".banner-slide")
        );

        const bannerDots = Array.from(
            bannerSlider.querySelectorAll(".banner-dot")
        );

        const prevButton =
            bannerSlider.querySelector("#bannerPrev");

        const nextButton =
            bannerSlider.querySelector("#bannerNext");

        const currentCounter =
            bannerSlider.querySelector("#bannerCurrent");

        const totalCounter =
            bannerSlider.querySelector("#bannerTotal");

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        let currentIndex = Math.max(
            0,
            slides.findIndex(slide =>
                slide.classList.contains("active")
            )
        );

        let bannerTimer = null;
        let touchStartX = 0;

        const bannerInterval = 5500;

        function showBanner(index) {

            if (!slides.length) return;

            currentIndex =
                (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {

                const active = i === currentIndex;

                slide.classList.toggle("active", active);

                slide.setAttribute(
                    "aria-hidden",
                    String(!active)
                );

            });

            bannerDots.forEach((dot, i) => {

                const active = i === currentIndex;

                dot.classList.toggle("active", active);

                if (active) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }

            });

            if (currentCounter) {
                currentCounter.textContent =
                    String(currentIndex + 1).padStart(2, "0");
            }

            if (totalCounter) {
                totalCounter.textContent =
                    String(slides.length).padStart(2, "0");
            }

        }

        function nextBanner() {
            showBanner(currentIndex + 1);
        }

        function previousBanner() {
            showBanner(currentIndex - 1);
        }

        function stopBannerAutoplay() {

            if (bannerTimer !== null) {
                clearInterval(bannerTimer);
                bannerTimer = null;
            }

        }

        function startBannerAutoplay() {

            stopBannerAutoplay();

            if (
                reducedMotion.matches ||
                document.hidden ||
                slides.length < 2 ||
                bannerSlider.matches(":hover") ||
                bannerSlider.contains(document.activeElement)
            ) {
                return;
            }

            bannerTimer = setInterval(
                nextBanner,
                bannerInterval
            );

        }

        if (nextButton) {

            nextButton.addEventListener("click", () => {

                nextBanner();
                startBannerAutoplay();

            });

        }

        if (prevButton) {

            prevButton.addEventListener("click", () => {

                previousBanner();
                startBannerAutoplay();

            });

        }

        bannerDots.forEach((dot, index) => {

            dot.addEventListener("click", () => {

                showBanner(index);
                startBannerAutoplay();

            });

        });

        bannerSlider.addEventListener(
            "mouseenter",
            stopBannerAutoplay
        );

        bannerSlider.addEventListener(
            "mouseleave",
            startBannerAutoplay
        );

        bannerSlider.addEventListener(
            "focusin",
            stopBannerAutoplay
        );

        bannerSlider.addEventListener("focusout", event => {

            if (!bannerSlider.contains(event.relatedTarget)) {
                startBannerAutoplay();
            }

        });

        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {
                stopBannerAutoplay();
            } else {
                startBannerAutoplay();
            }

        });

        reducedMotion.addEventListener(
            "change",
            startBannerAutoplay
        );

        bannerSlider.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0].clientX;

            },
            { passive: true }
        );

        bannerSlider.addEventListener(
            "touchend",
            event => {

                const touchEndX =
                    event.changedTouches[0].clientX;

                const difference =
                    touchEndX - touchStartX;

                if (Math.abs(difference) < 50) return;

                if (difference < 0) {
                    nextBanner();
                } else {
                    previousBanner();
                }

                startBannerAutoplay();

            },
            { passive: true }
        );

        showBanner(currentIndex);
        startBannerAutoplay();

    }


    /* =================================================
       11. IMAGE LAZY LOADING
    ================================================= */

    document.querySelectorAll("img").forEach(img => {

        if (
            !img.hasAttribute("loading") &&
            !img.closest(".lot-banner") &&
            !img.closest(".hero-bg")
        ) {
            img.setAttribute("loading", "lazy");
        }

        if (!img.hasAttribute("decoding")) {
            img.setAttribute("decoding", "async");
        }

    });


    /* =================================================
       12. FOOTER COPYRIGHT YEAR
    ================================================= */

    const copyrightYear =
        document.getElementById("copyrightYear");

    if (copyrightYear) {
        copyrightYear.textContent =
            new Date().getFullYear();
    }


    /* =================================================
       13. INITIALIZE
    ================================================= */

    console.log(
        "LOT Solutions website initialized successfully."
    );

});

/* ==================== 07. PROCESS ==================== */

document.addEventListener("DOMContentLoaded", function () {

    // Initialize AOS only if it has not already been initialized.
    if (typeof AOS !== "undefined" && !document.body.dataset.aosReady) {
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 70
        });

        document.body.dataset.aosReady = "true";
    }

    // Process card keyboard accessibility
    const processCards = document.querySelectorAll(".process-card");

    processCards.forEach(function (card) {
        card.setAttribute("tabindex", "0");

        card.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                card.blur();
            }
        });
    });

    // Smooth navigation to contact section
    const processCta = document.querySelector(".process-cta");

    if (processCta) {
        processCta.addEventListener("click", function (event) {
            const target = document.querySelector(
                processCta.getAttribute("href")
            );

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    }

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