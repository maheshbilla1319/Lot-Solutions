/* =========================================================
   LOT SOLUTIONS - ADMIN DASHBOARD JS
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
    const menuToggle = $("menuToggle");
    const sidebarOverlay = $("sidebarOverlay");
    const globalSearch = $("globalSearch");
    const projectSearch = $("projectSearch");
    const statusFilter = $("statusFilter");
    const tableBody = $("projectsTableBody");
    const tableEmpty = $("tableEmpty");
    const projectCount = $("projectCount");
    const projectModal = $("projectModal");
    const newProjectForm = $("newProjectForm");
    const toast = $("toast");
    const toastMessage = $("toastMessage");
    const breadcrumbCurrent = $("breadcrumbCurrent");

    $("footerYear").textContent = new Date().getFullYear();

    /* TOAST */
    let toastTimer;
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
    }

    /* MOBILE SIDEBAR (796px and below) */
    function openSidebar() {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("show");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close sidebar");
        document.body.classList.add("sidebar-open");
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open sidebar");
        document.body.classList.remove("sidebar-open");
    }

    menuToggle.addEventListener("click", () =>
        sidebar.classList.contains("open") ? closeSidebar() : openSidebar()
    );
    sidebarOverlay.addEventListener("click", closeSidebar);

    window.addEventListener("resize", () => {
        if (window.innerWidth > 796) closeSidebar();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        closeSidebar();
        closeProjectModal();
    });

    /* SIDEBAR NAVIGATION */
    const pageTitles = {
        overview: "Dashboard",
        projects: "Projects",
        customers: "Customers",
        analytics: "Analytics",
        team: "Team Members"
    };

    function setActive(page) {
        document.querySelectorAll(".nav-link").forEach((item) => {
            item.classList.toggle("active", item.dataset.page === page);
        });
        breadcrumbCurrent.textContent = pageTitles[page] || "Dashboard";
    }

    document.querySelectorAll("[data-page]").forEach((link) => {
        link.addEventListener("click", (event) => {
            const page = link.dataset.page;
            if (!pageTitles[page]) return;

            const isNav = link.classList.contains("nav-link");
            const hasTarget = Boolean($(page));

            if (!hasTarget && isNav) {
                // Sidebar item with no section on this page
                event.preventDefault();
                setActive(page);
                closeSidebar();
                showToast(`${pageTitles[page]} selected. Connect this menu to its page or data view.`);
                return;
            }

            if (hasTarget) setActive(page);
            closeSidebar();
        });
    });

    /* MOBILE SEARCH TOGGLE (520px and below) */
    const searchBox = document.querySelector(".search-box");
    searchBox.querySelector("i").addEventListener("click", () => {
        if (window.innerWidth > 520) return;
        searchBox.classList.toggle("search-open");
        if (searchBox.classList.contains("search-open")) globalSearch.focus();
    });

    /* PROJECT TABLE FILTER */
    function filterProjects() {
        const query = projectSearch.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;
        const rows = Array.from(tableBody.querySelectorAll("tr"));
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesQuery = row.textContent.toLowerCase().includes(query);
            const matchesStatus = selectedStatus === "all" || row.dataset.status === selectedStatus;
            row.hidden = !(matchesQuery && matchesStatus);
            if (!row.hidden) visibleCount++;
        });

        tableEmpty.classList.toggle("show", visibleCount === 0);
        projectCount.textContent = `Showing ${visibleCount} of ${rows.length} projects`;
    }

    projectSearch.addEventListener("input", filterProjects);
    statusFilter.addEventListener("change", filterProjects);

    globalSearch.addEventListener("input", () => {
        const query = globalSearch.value.trim();
        projectSearch.value = query;
        filterProjects();
        if (query) {
            $("projects").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
    });

    /* COUNTERS */
    function animateCounter(element) {
        if (element.dataset.animated === "true") return;
        element.dataset.animated = "true";

        const target = Number(element.dataset.target) || 0;

        if (reduceMotion) {
            element.textContent = target.toLocaleString();
            return;
        }

        const duration = 1300;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            element.textContent = Math.round(target * eased).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const counters = document.querySelectorAll(".counter");

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.35 });
        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }

    /* CHART.JS */
    const chartCanvas = $("activityChart");
    let activityChart = null;

    const chartData = {
        week: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            completed: [24, 36, 30, 48, 41, 56, 49],
            progress: [16, 22, 18, 27, 24, 31, 26]
        },
        month: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            completed: [48, 66, 58, 86],
            progress: [28, 39, 33, 47]
        },
        year: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            completed: [34, 42, 48, 44, 60, 55, 68, 72, 65, 86, 78, 92],
            progress: [20, 26, 28, 24, 37, 34, 42, 46, 39, 52, 48, 59]
        }
    };

    function lineSet(label, data, border, fill, width, pointBorder) {
        return {
            label, data, borderColor: border, backgroundColor: fill, fill: true, tension: 0.4,
            borderWidth: width, pointRadius: 3, pointHoverRadius: 5,
            pointBackgroundColor: "#FFFFFF", pointBorderColor: pointBorder, pointBorderWidth: 2
        };
    }

    function renderActivityChart(period = "month") {
        if (typeof Chart === "undefined" || !chartCanvas) {
            document.querySelector(".chart-wrap").textContent =
                "Chart library could not load. Check your internet connection.";
            return;
        }

        const selected = chartData[period] || chartData.month;
        if (activityChart) activityChart.destroy();

        const tick = { color: "#8292A1", font: { family: "DM Sans", size: 9 } };

        activityChart = new Chart(chartCanvas, {
            type: "line",
            data: {
                labels: selected.labels,
                datasets: [
                    lineSet("Completed", selected.completed, "#00D9FF", "rgba(0, 217, 255, 0.12)", 2.5, "#00BFD9"),
                    lineSet("In progress", selected.progress, "#071A2B", "rgba(7, 26, 43, 0.025)", 2, "#071A2B")
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: "index" },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#071A2B",
                        titleFont: { family: "DM Sans", size: 11 },
                        bodyFont: { family: "DM Sans", size: 10 },
                        padding: 11, usePointStyle: true
                    }
                },
                scales: {
                    x: { grid: { display: false }, border: { display: false }, ticks: { ...tick, maxRotation: 0 } },
                    y: {
                        beginAtZero: true,
                        border: { display: false, dash: [4, 4] },
                        grid: { color: "#EDF1F4", drawTicks: false },
                        ticks: { ...tick, padding: 9, precision: 0 }
                    }
                }
            }
        });
    }

    renderActivityChart();
    $("chartPeriod").addEventListener("change", (event) => renderActivityChart(event.target.value));

    /* CREATE PROJECT MODAL */
    const projectNameInput = $("newProjectName");
    const projectOwnerInput = $("newProjectOwner");

    function openProjectModal() {
        projectModal.classList.add("open");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        setTimeout(() => projectNameInput.focus(), 80);
    }

    function closeProjectModal() {
        projectModal.classList.remove("open");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    $("createProjectButton").addEventListener("click", openProjectModal);
    $("closeModal").addEventListener("click", closeProjectModal);
    $("cancelModal").addEventListener("click", closeProjectModal);
    projectModal.addEventListener("click", (event) => {
        if (event.target === projectModal) closeProjectModal();
    });

    function escapeHTML(value) {
        const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
        return String(value).replace(/[&<>"']/g, (c) => entities[c]);
    }

    newProjectForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = projectNameInput.value.trim();
        const owner = projectOwnerInput.value.trim();

        if (!name || !owner) {
            showToast("Please enter the project name and owner.");
            return;
        }

        const initials = escapeHTML(
            owner.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()
        );
        const safeName = escapeHTML(name);
        const safeOwner = escapeHTML(owner);

        const row = document.createElement("tr");
        row.dataset.status = "Planning";
        row.innerHTML = `
            <td><div class="project-cell"><span class="project-symbol symbol-cyan"><i class="fa-solid fa-folder"></i></span><div><strong>${safeName}</strong><span>New project</span></div></div></td>
            <td><div class="owner-cell"><span class="owner-avatar">${initials}</span><span>${safeOwner}</span></div></td>
            <td><div class="progress-cell"><div class="progress-track"><span></span></div><small>0%</small></div></td>
            <td>Not set</td>
            <td><span class="status-badge status-planning">Planning</span></td>
            <td><button class="icon-button row-action" type="button" aria-label="View ${safeName}" data-project="${safeName}"><i class="fa-solid fa-arrow-up-right-from-square"></i></button></td>
        `;

        tableBody.prepend(row);
        closeProjectModal();
        newProjectForm.reset();
        filterProjects();
        showToast(`"${name}" was added to this demo dashboard.`);
    });

    /* ROW ACTIONS */
    tableBody.addEventListener("click", (event) => {
        const button = event.target.closest("[data-project]");
        if (!button) return;
        showToast(`Selected "${button.dataset.project}". Connect a project details page to view full information.`);
    });

    /* EXPORT CSV */
    $("exportButton").addEventListener("click", () => {
        const rows = Array.from(tableBody.querySelectorAll("tr:not([hidden])"));
        const csvRows = [["Project", "Owner", "Progress", "Deadline", "Status"]];

        rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 5) return;
            const clean = (cell) => cell.innerText.trim().replace(/\s*\n\s*/g, " ");
            csvRows.push([clean(cells[0]), clean(cells[1]), clean(cells[2]), clean(cells[3]), clean(cells[4])]);
        });

        const escapeCSV = (value) => `"${String(value).replace(/"/g, '""')}"`;
        const csv = csvRows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");

        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = "lot-solutions-project-report.csv";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);

        showToast("Project report exported as CSV.");
    });

    /* NOTIFICATIONS / PROFILE / ACTIVITY (demo toasts) */
    $("notificationButton").addEventListener("click", () =>
        showToast("You have workspace notifications. Connect your notification service to load real alerts.")
    );
    $("topbarProfile").addEventListener("click", () =>
        showToast("LOT Admin profile selected. Connect your account settings page to manage your profile.")
    );
    $("activityMore").addEventListener("click", () => showToast("Activity options selected."));

    /* CHECKLIST */
    const taskList = $("taskList");
    const taskCount = $("taskCount");

    function updateTaskCount(announce) {
        const boxes = Array.from(taskList.querySelectorAll('input[type="checkbox"]'));
        const done = boxes.filter((box) => box.checked).length;
        taskCount.textContent = `${done} / ${boxes.length}`;
        if (announce && done === boxes.length) showToast("All checklist tasks are complete!");
    }

    taskList.addEventListener("change", (event) => {
        if (event.target.matches('input[type="checkbox"]')) updateTaskCount(true);
    });

    updateTaskCount(false);
    filterProjects();
});