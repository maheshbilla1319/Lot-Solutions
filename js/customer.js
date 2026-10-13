
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================
       AOS SCROLL ANIMATIONS
    ========================================= */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 750,
            easing: "ease-out-cubic",
            once: true,
            offset: 45,
            disable: reduceMotion
        });
    }

    /* =========================================
       ELEMENTS AND UTILITIES
    ========================================= */

    const sidebar = document.getElementById("customerSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const menuToggle = document.getElementById("menuToggle");
    const toast = document.getElementById("customerToast");
    const toastMessage = document.getElementById("customerToastMessage");

    let toastTimer;
    let activeModal = null;
    let lastFocusedElement = null;
    let currentFilter = "all";

    document.getElementById("footerYear").textContent =
        new Date().getFullYear();

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

    /* =========================================
       MOBILE SIDEBAR
    ========================================= */

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

    menuToggle.addEventListener("click", () => {
        sidebar.classList.contains("open")
            ? closeSidebar()
            : openSidebar();
    });

    overlay.addEventListener("click", closeSidebar);

    window.addEventListener("resize", () => {
        if (window.innerWidth > 796) {
            closeSidebar();
        }
    });

    /* =========================================
       MODAL HELPERS
    ========================================= */

    function openModal(modal) {
        if (!modal) return;

        if (activeModal && activeModal !== modal) {
            closeModal(activeModal);
        }

        lastFocusedElement = document.activeElement;
        activeModal = modal;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        const focusable = modal.querySelector(
            "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])"
        );

        if (focusable) {
            requestAnimationFrame(() => focusable.focus());
        }
    }

    function closeModal(modal) {
        if (!modal) return;

        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");

        if (activeModal === modal) {
            activeModal = null;
        }

        document.body.style.overflow = sidebar.classList.contains("open")
            ? "hidden"
            : "";

        if (lastFocusedElement && document.contains(lastFocusedElement)) {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.querySelectorAll(".modal-close").forEach(button => {
        button.addEventListener("click", () => {
            closeModal(button.closest(".modal-overlay"));
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (activeModal) {
                closeModal(activeModal);
            } else {
                closeSidebar();
            }
        }
    });

    /* =========================================
       SIDEBAR NAVIGATION AND ACTIVE LINKS
    ========================================= */

    const navLinks = document.querySelectorAll(".nav-link");
    const breadcrumbTitle = document.getElementById("breadcrumbTitle");

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
        navLinks.forEach(link => {
            const isActive = link.dataset.section === sectionName;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        breadcrumbTitle.textContent =
            sectionNames[sectionName] || "Overview";
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            const sectionName = link.dataset.section;

            setActiveNavigation(sectionName);
            closeSidebar();
        });
    });

    const observedSections = Object.keys(sectionNames)
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            const visibleSections = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) =>
                    b.intersectionRatio - a.intersectionRatio
                );

            if (visibleSections.length) {
                setActiveNavigation(visibleSections[0].target.id);
            }
        }, {
            rootMargin: "-18% 0px -62% 0px",
            threshold: [0, 0.15, 0.35, 0.6]
        });

        observedSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    /* =========================================
       CUSTOMER PROFILE
    ========================================= */

    const profileModal = document.getElementById("profileModal");
    const profileForm = document.getElementById("profileForm");
    const editNameInput = document.getElementById("editCustomerName");
    const editEmailInput = document.getElementById("editCustomerEmail");

    const profileDisplayName = document.getElementById("profileDisplayName");
    const profileEmail = document.getElementById("profileEmail");
    const welcomeCustomerName = document.getElementById("welcomeCustomerName");
    const sidebarCustomerName = document.getElementById("sidebarCustomerName");
    const topbarCustomerName = document.getElementById("topbarCustomerName");

    let customerName = "Jordan Davis";
    let customerEmail = "jordan@example.com";

    function renderCustomerProfile() {
        const firstName = customerName.trim().split(/\s+/)[0] || "Customer";
        const initials = customerName
            .trim()
            .split(/\s+/)
            .map(part => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

        welcomeCustomerName.textContent = firstName;
        sidebarCustomerName.textContent = customerName;
        topbarCustomerName.textContent = customerName;
        profileDisplayName.textContent = customerName;
        profileEmail.textContent = customerEmail;

        document.querySelectorAll(".avatar, .profile-avatar-large").forEach(
            avatar => {
                avatar.textContent = initials;
            }
        );
    }

    document.getElementById("editProfileButton").addEventListener("click", () => {
        editNameInput.value = customerName;
        editEmailInput.value = customerEmail;
        openModal(profileModal);
    });

    profileForm.addEventListener("submit", event => {
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

    document.getElementById("cancelProfile").addEventListener("click", () => {
        closeModal(profileModal);
    });

    document.getElementById("closeProfileModal").addEventListener("click", () => {
        closeModal(profileModal);
    });

    document.getElementById("topbarUser").addEventListener("click", () => {
        editNameInput.value = customerName;
        editEmailInput.value = customerEmail;
        openModal(profileModal);
    });

    document.getElementById("accountMenuButton").addEventListener("click", () => {
        editNameInput.value = customerName;
        editEmailInput.value = customerEmail;
        openModal(profileModal);
    });

    renderCustomerProfile();

    /* =========================================
       COUNTER ANIMATIONS
    ========================================= */

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
        const startTime = performance.now();

        function updateCounter(time) {
            const progress = Math.min((time - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 4);

            element.textContent = Math.round(
                target * easedProgress
            ).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }

    /* =========================================
       REQUEST FILTERS AND SEARCH
    ========================================= */

    const requestList = document.getElementById("requestList");
    const requestEmpty = document.getElementById("requestEmpty");
    const requestTotal = document.getElementById("requestTotal");
    const customerSearch = document.getElementById("customerSearch");

    function filterRequests() {
        const query = customerSearch.value.trim().toLowerCase();
        const rows = Array.from(requestList.querySelectorAll(".request-row"));

        let visibleCount = 0;

        rows.forEach(row => {
            const status = row.dataset.status;
            const text = row.textContent.toLowerCase();

            const matchesStatus =
                currentFilter === "all" || status === currentFilter;

            const matchesQuery = text.includes(query);
            const visible = matchesStatus && matchesQuery;

            row.hidden = !visible;

            if (visible) visibleCount++;
        });

        requestEmpty.classList.toggle("show", visibleCount === 0);

        requestTotal.textContent =
            `${visibleCount} ${visibleCount === 1 ? "request" : "requests"}`;
    }

    document.querySelectorAll(".request-tab").forEach(button => {
        button.addEventListener("click", () => {
            currentFilter = button.dataset.filter;

            document.querySelectorAll(".request-tab").forEach(tab => {
                const active = tab === button;
                tab.classList.toggle("active", active);
                tab.setAttribute("aria-pressed", String(active));
            });

            filterRequests();
        });

        button.setAttribute(
            "aria-pressed",
            String(button.classList.contains("active"))
        );
    });

    customerSearch.addEventListener("input", filterRequests);

    /* =========================================
       REQUEST DETAILS
    ========================================= */

    const detailsModal = document.getElementById("detailsModal");
    const detailsTitle = document.getElementById("detailsTitle");
    const detailsDescription = document.getElementById("detailsDescription");

    function openDetails(title, description) {
        detailsTitle.textContent = title;
        detailsDescription.textContent = description;
        openModal(detailsModal);
    }

    requestList.addEventListener("click", event => {
        const button = event.target.closest(".request-details");

        if (!button) return;

        openDetails(
            button.dataset.title,
            button.dataset.description
        );
    });

    document.getElementById("closeDetailsButton").addEventListener("click", () => {
        closeModal(detailsModal);
    });

    document.getElementById("closeDetailsModal").addEventListener("click", () => {
        closeModal(detailsModal);
    });

    /* =========================================
       CREATE NEW CUSTOMER REQUEST
    ========================================= */

    const requestModal = document.getElementById("requestModal");
    const requestForm = document.getElementById("requestForm");
    const requestTitleInput = document.getElementById("requestTitle");
    const requestCategoryInput = document.getElementById("requestCategory");
    const requestDescriptionInput = document.getElementById("requestDescription");

    document.getElementById("newRequestButton").addEventListener("click", () => {
        requestForm.reset();
        openModal(requestModal);
    });

    document.getElementById("supportButton").addEventListener("click", () => {
        requestForm.reset();
        openModal(requestModal);
    });

    document.getElementById("cancelRequest").addEventListener("click", () => {
        closeModal(requestModal);
    });

    document.getElementById("closeRequestModal").addEventListener("click", () => {
        closeModal(requestModal);
    });

    requestForm.addEventListener("submit", event => {
        event.preventDefault();

        const title = requestTitleInput.value.trim();
        const category = requestCategoryInput.value;
        const description = requestDescriptionInput.value.trim();

        if (!title || !category || !description) {
            showToast("Please complete all request fields.");
            return;
        }

        if (
            !requestTitleInput.checkValidity() ||
            !requestDescriptionInput.checkValidity()
        ) {
            showToast("Please check the information you entered.");
            return;
        }

        const requestNumber = 1043 +
            requestList.querySelectorAll(".request-row").length - 3;

        const requestId = `REQ-${requestNumber}`;

        const row = document.createElement("article");
        row.className = "request-row";
        row.dataset.status = "In progress";

        const iconMap = {
            "Website Development": "fa-laptop-code",
            "UI/UX Design": "fa-palette",
            "Digital Consulting": "fa-chart-simple",
            "General Support": "fa-headset"
        };

        const icon = iconMap[category] || "fa-clipboard-list";

        row.innerHTML = `
            <span class="request-icon">
                <i class="fa-solid ${icon}"></i>
            </span>
            <div class="request-info">
                <strong>${escapeHTML(title)}</strong>
                <span>${escapeHTML(requestId)} · ${escapeHTML(category)}</span>
            </div>
            <span class="request-date">Just now</span>
            <span class="request-status status-progress">In progress</span>
            <button class="row-action request-details"
                    type="button"
                    aria-label="View ${escapeHTML(title)} request"
                    data-title="${escapeHTML(title)}"
                    data-description="${escapeHTML(description)}">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
        `;

        requestList.prepend(row);

        closeModal(requestModal);
        requestForm.reset();

        currentFilter = "all";
        document.querySelectorAll(".request-tab").forEach(tab => {
            const active = tab.dataset.filter === "all";
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-pressed", String(active));
        });

        customerSearch.value = "";
        filterRequests();

        showToast("Your sample request was added to the dashboard.");

        document.getElementById("requests").scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start"
        });
    });

    /* =========================================
       INVOICE DETAILS
    ========================================= */

    document.querySelectorAll(".invoice-action").forEach(button => {
        button.addEventListener("click", () => {
            const invoiceNumber = button.dataset.invoice;

            openDetails(
                `Invoice ${invoiceNumber}`,
                "This is a sample invoice record. Connect your billing system to display the real invoice document, payment status, and downloadable receipt."
            );
        });
    });

    /* =========================================
       NOTIFICATIONS
    ========================================= */

    document.getElementById("notificationButton").addEventListener("click", () => {
        showToast("You are viewing the sample customer portal. Connect a notification service to receive real updates.");
    });

    /* =========================================
       NOTIFICATION PREFERENCES
    ========================================= */

    document.getElementById("projectNotifications").addEventListener("change", event => {
        showToast(
            `Project notifications ${event.target.checked ? "enabled" : "disabled"} for this demo.`
        );
    });

    document.getElementById("supportNotifications").addEventListener("change", event => {
        showToast(
            `Support notifications ${event.target.checked ? "enabled" : "disabled"} for this demo.`
        );
    });

    /* =========================================
       INITIALISE REQUEST FILTER
    ========================================= */

    filterRequests();
});
