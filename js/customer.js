/* =========================================================
   LOT SOLUTIONS - CUSTOMER DASHBOARD JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* AOS */
    if (typeof AOS !== "undefined") {
        AOS.init({ duration: 750, easing: "ease-out-cubic", once: true, offset: 45, disable: reduceMotion });
    }

    /* ELEMENTS */
    const sidebar = $("sidebar");
    const overlay = $("sidebarOverlay");
    const menuToggle = $("menuToggle");
    const toast = $("customerToast");
    const toastMessage = $("customerToastMessage");

    let toastTimer;
    let activeModal = null;
    let lastFocusedElement = null;
    let currentFilter = "all";

    $("footerYear").textContent = new Date().getFullYear();

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
    }

    function escapeHTML(value) {
        const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
        return String(value).replace(/[&<>"']/g, (c) => entities[c]);
    }

    /* MOBILE SIDEBAR (796px and below) */
    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("show");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation");
        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        document.body.style.overflow = activeModal ? "hidden" : "";
    }

    menuToggle.addEventListener("click", () =>
        sidebar.classList.contains("open") ? closeSidebar() : openSidebar()
    );
    overlay.addEventListener("click", closeSidebar);

    window.addEventListener("resize", () => {
        if (window.innerWidth > 796) closeSidebar();
    });

    /* MODAL HELPERS */
    function openModal(modal) {
        if (!modal) return;
        if (activeModal && activeModal !== modal) closeModal(activeModal);

        lastFocusedElement = document.activeElement;
        activeModal = modal;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        const focusable = modal.querySelector(
            "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not(.modal-close)"
        );
        if (focusable) requestAnimationFrame(() => focusable.focus());
    }

    function closeModal(modal) {
        if (!modal) return;

        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        if (activeModal === modal) activeModal = null;

        document.body.style.overflow = sidebar.classList.contains("open") ? "hidden" : "";

        if (lastFocusedElement && document.contains(lastFocusedElement)) {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll(".modal-overlay").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal(modal);
        });
    });

    document.querySelectorAll(".modal-close").forEach((button) => {
        button.addEventListener("click", () => closeModal(button.closest(".modal-overlay")));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (activeModal) closeModal(activeModal);
        else closeSidebar();
    });

    /* SIDEBAR NAVIGATION + ACTIVE LINK */
    const navLinks = document.querySelectorAll(".nav-link");
    const breadcrumbTitle = $("breadcrumbTitle");

    const sectionNames = {
        overview: "Overview",
        services: "My Services",
        requests: "My Requests",
        invoices: "Invoices",
        support: "Help & Support",
        profile: "My Profile",
        settings: "Settings"
    };

    function setActiveNavigation(sectionName) {
        navLinks.forEach((link) => {
            const isActive = link.dataset.section === sectionName;
            link.classList.toggle("active", isActive);
            if (isActive) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
        breadcrumbTitle.textContent = sectionNames[sectionName] || "Overview";
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            setActiveNavigation(link.dataset.section);
            closeSidebar();
        });
    });

    document.querySelectorAll(".sidebar-help > a").forEach((link) =>
        link.addEventListener("click", closeSidebar)
    );

    const observedSections = Object.keys(sectionNames).map((id) => $(id)).filter(Boolean);

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            if (visible.length) setActiveNavigation(visible[0].target.id);
        }, { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.15, 0.35, 0.6] });

        observedSections.forEach((section) => sectionObserver.observe(section));
    }

    /* CUSTOMER PROFILE */
    const profileModal = $("profileModal");
    const profileForm = $("profileForm");
    const editNameInput = $("editCustomerName");
    const editEmailInput = $("editCustomerEmail");

    let customerName = "Jordan Davis";
    let customerEmail = "jordan@example.com";

    function renderCustomerProfile() {
        const parts = customerName.trim().split(/\s+/);
        const firstName = parts[0] || "Customer";
        const initials = parts.map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase();

        $("welcomeCustomerName").textContent = firstName;
        $("sidebarCustomerName").textContent = customerName;
        $("topbarCustomerName").textContent = customerName;
        $("profileDisplayName").textContent = customerName;
        $("profileEmail").textContent = customerEmail;

        document.querySelectorAll(".avatar, .profile-avatar-large").forEach((avatar) => {
            avatar.textContent = initials;
        });
    }

    function openProfileEditor() {
        editNameInput.value = customerName;
        editEmailInput.value = customerEmail;
        openModal(profileModal);
    }

    $("editProfileButton").addEventListener("click", openProfileEditor);
    $("topbarUser").addEventListener("click", openProfileEditor);
    $("accountMenuButton").addEventListener("click", openProfileEditor);
    $("cancelProfile").addEventListener("click", () => closeModal(profileModal));

    profileForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newName = editNameInput.value.trim();
        const newEmail = editEmailInput.value.trim();

        if (!newName || !newEmail || !editEmailInput.checkValidity()) {
            showToast("Please enter a valid name and email address.");
            return;
        }

        customerName = newName;
        customerEmail = newEmail;
        renderCustomerProfile();
        closeModal(profileModal);
        showToast("Your sample profile has been updated.");
    });

    renderCustomerProfile();

    /* COUNTERS */
    const counters = document.querySelectorAll(".counter");

    function animateCounter(element) {
        if (element.dataset.animated === "true") return;
        element.dataset.animated = "true";

        const target = Number(element.dataset.target) || 0;

        if (reduceMotion) {
            element.textContent = target.toLocaleString();
            return;
        }

        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            element.textContent = Math.round(target * eased).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }

    /* REQUEST FILTERS + SEARCH */
    const requestList = $("requestList");
    const requestEmpty = $("requestEmpty");
    const requestTotal = $("requestTotal");
    const customerSearch = $("customerSearch");

    function filterRequests() {
        const query = customerSearch.value.trim().toLowerCase();
        const rows = Array.from(requestList.querySelectorAll(".request-row"));
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesStatus = currentFilter === "all" || row.dataset.status === currentFilter;
            const matchesQuery = row.textContent.toLowerCase().includes(query);
            row.hidden = !(matchesStatus && matchesQuery);
            if (!row.hidden) visibleCount++;
        });

        requestEmpty.classList.toggle("show", visibleCount === 0);
        requestTotal.textContent = `${visibleCount} ${visibleCount === 1 ? "request" : "requests"}`;
    }

    function setRequestTab(filter) {
        currentFilter = filter;
        document.querySelectorAll(".request-tab").forEach((tab) => {
            const active = tab.dataset.filter === filter;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-pressed", String(active));
        });
        filterRequests();
    }

    document.querySelectorAll(".request-tab").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.classList.contains("active")));
        button.addEventListener("click", () => setRequestTab(button.dataset.filter));
    });

    customerSearch.addEventListener("input", () => {
        filterRequests();
        if (customerSearch.value.trim()) {
            $("requests").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
    });

    /* MOBILE SEARCH TOGGLE (520px and below) */
    const searchBox = document.querySelector(".search-box");
    searchBox.querySelector("i").addEventListener("click", () => {
        if (window.innerWidth > 520) return;
        searchBox.classList.toggle("search-open");
        if (searchBox.classList.contains("search-open")) customerSearch.focus();
    });

    /* REQUEST / INVOICE DETAILS */
    const detailsModal = $("detailsModal");

    function openDetails(title, description) {
        $("detailsTitle").textContent = title;
        $("detailsDescription").textContent = description;
        openModal(detailsModal);
    }

    requestList.addEventListener("click", (event) => {
        const button = event.target.closest(".request-details");
        if (button) openDetails(button.dataset.title, button.dataset.description);
    });

    $("closeDetailsButton").addEventListener("click", () => closeModal(detailsModal));

    document.querySelectorAll(".invoice-action").forEach((button) => {
        button.addEventListener("click", () => {
            openDetails(
                `Invoice ${button.dataset.invoice}`,
                "This is a sample invoice record. Connect your billing system to display the real invoice document, payment status, and downloadable receipt."
            );
        });
    });

    /* CREATE NEW REQUEST */
    const requestModal = $("requestModal");
    const requestForm = $("requestForm");
    const requestTitleInput = $("requestTitle");
    const requestCategoryInput = $("requestCategory");
    const requestDescriptionInput = $("requestDescription");

    function openRequestForm() {
        requestForm.reset();
        openModal(requestModal);
    }

    $("newRequestButton").addEventListener("click", openRequestForm);
    $("supportButton").addEventListener("click", openRequestForm);
    $("cancelRequest").addEventListener("click", () => closeModal(requestModal));

    requestForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = requestTitleInput.value.trim();
        const category = requestCategoryInput.value;
        const description = requestDescriptionInput.value.trim();

        if (!title || !category || !description) {
            showToast("Please complete all request fields.");
            return;
        }

        const requestId = `REQ-${1043 + requestList.querySelectorAll(".request-row").length - 3}`;

        const iconMap = {
            "Website Development": "fa-laptop-code",
            "UI/UX Design": "fa-palette",
            "Digital Consulting": "fa-chart-simple",
            "General Support": "fa-headset"
        };
        const icon = iconMap[category] || "fa-clipboard-list";

        const row = document.createElement("article");
        row.className = "request-row";
        row.dataset.status = "In progress";
        row.innerHTML = `
            <span class="request-icon"><i class="fa-solid ${icon}"></i></span>
            <div class="request-info">
                <strong>${escapeHTML(title)}</strong>
                <span>${escapeHTML(requestId)} · ${escapeHTML(category)}</span>
            </div>
            <span class="request-date">Just now</span>
            <span class="request-status status-progress">In progress</span>
            <button class="row-action request-details" type="button"
                    aria-label="View ${escapeHTML(title)} request"
                    data-title="${escapeHTML(title)}"
                    data-description="${escapeHTML(description)}">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
        `;

        requestList.prepend(row);

        closeModal(requestModal);
        requestForm.reset();
        customerSearch.value = "";
        setRequestTab("all");

        showToast("Your sample request was added to the dashboard.");
        $("requests").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });

    /* NOTIFICATIONS + PREFERENCES */
    $("notificationButton").addEventListener("click", () =>
        showToast("You are viewing the sample customer portal. Connect a notification service to receive real updates.")
    );

    $("projectNotifications").addEventListener("change", (event) =>
        showToast(`Project notifications ${event.target.checked ? "enabled" : "disabled"} for this demo.`)
    );
    $("supportNotifications").addEventListener("change", (event) =>
        showToast(`Support notifications ${event.target.checked ? "enabled" : "disabled"} for this demo.`)
    );

    /* INITIAL STATE */
    filterRequests();
});