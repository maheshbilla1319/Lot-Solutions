
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================
       AOS ANIMATIONS
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
       ELEMENTS
    ========================================= */

    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const globalSearch = document.getElementById("globalSearch");
    const projectSearch = document.getElementById("projectSearch");
    const statusFilter = document.getElementById("statusFilter");
    const tableBody = document.getElementById("projectsTableBody");
    const tableEmpty = document.getElementById("tableEmpty");
    const projectCount = document.getElementById("projectCount");
    const projectModal = document.getElementById("projectModal");
    const newProjectForm = document.getElementById("newProjectForm");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    document.getElementById("footerYear").textContent =
        new Date().getFullYear();

    let toastTimer;
    let projectNumber = 5;

    /* =========================================
       TOAST MESSAGE
    ========================================= */

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    }

    /* =========================================
       MOBILE SIDEBAR
    ========================================= */

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

    menuToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    sidebarOverlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSidebar();
            closeProjectModal();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 796) {
            closeSidebar();
        }
    });

    /* =========================================
       SIDEBAR NAVIGATION
    ========================================= */

    const pageTitles = {
        overview: "Dashboard overview",
        projects: "Projects",
        customers: "Customers",
        analytics: "Analytics",
        messages: "Messages",
        team: "Team Members",
        reports: "Reports",
        settings: "Settings",
        support: "Support"
    };

    const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");
    const pageTitle = document.getElementById("pageTitle");

    document.querySelectorAll(".nav-link, [data-page]").forEach((link) => {
        link.addEventListener("click", (event) => {
            const page = link.dataset.page;

            if (!page || !pageTitles[page]) return;

            const target = document.getElementById(page);

            /*
             * Some sidebar destinations are demo navigation items
             * without separate page content in this single-page example.
             */
            if (!target && !link.classList.contains("nav-link")) {
                return;
            }

            if (!target && link.classList.contains("nav-link")) {
                event.preventDefault();

                document.querySelectorAll(".nav-link").forEach((item) => {
                    item.classList.toggle("active", item.dataset.page === page);
                });

                breadcrumbCurrent.textContent = pageTitles[page];
                pageTitle.innerHTML =
                    `${pageTitles[page]}<span>.</span>`;

                closeSidebar();

                showToast(
                    `${pageTitles[page]} selected. Connect this menu to its page or data view.`
                );

                return;
            }

            document.querySelectorAll(".nav-link").forEach((item) => {
                item.classList.toggle("active", item.dataset.page === page);
            });

            breadcrumbCurrent.textContent = pageTitles[page];
            pageTitle.innerHTML = `${pageTitles[page]}<span>.</span>`;

            closeSidebar();
        });
    });

    /* =========================================
       MOBILE SEARCH
    ========================================= */

    const searchBox = document.querySelector(".search-box");
    const searchIcon = searchBox.querySelector("i");

    searchIcon.addEventListener("click", () => {
        if (window.innerWidth <= 520) {
            searchBox.classList.toggle("search-open");

            if (searchBox.classList.contains("search-open")) {
                globalSearch.focus();
            }
        }
    });

    globalSearch.addEventListener("input", () => {
        const query = globalSearch.value.trim().toLowerCase();

        if (query) {
            projectSearch.value = query;
            filterProjects();

            document.getElementById("projects").scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        } else {
            projectSearch.value = "";
            filterProjects();
        }
    });

    /* =========================================
       PROJECT TABLE FILTER
    ========================================= */

    function filterProjects() {
        const query = projectSearch.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;

        const rows = Array.from(tableBody.querySelectorAll("tr"));
        let visibleCount = 0;

        rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            const status = row.dataset.status;

            const matchesQuery = text.includes(query);
            const matchesStatus =
                selectedStatus === "all" || status === selectedStatus;

            const visible = matchesQuery && matchesStatus;

            row.hidden = !visible;

            if (visible) visibleCount++;
        });

        tableEmpty.classList.toggle("show", visibleCount === 0);
        projectCount.textContent =
            `Showing ${visibleCount} of ${rows.length} projects`;
    }

    projectSearch.addEventListener("input", filterProjects);
    statusFilter.addEventListener("change", filterProjects);

    /* =========================================
       COUNTER ANIMATIONS
    ========================================= */

    function animateCounter(element) {
        if (element.dataset.animated === "true") return;

        element.dataset.animated = "true";

        const target = Number(element.dataset.target) || 0;

        if (reduceMotion) {
            element.textContent = target.toLocaleString();
            return;
        }

        const duration = 1300;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(target * eased);

            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
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

    /* =========================================
       CHART.JS
    ========================================= */

    const chartCanvas = document.getElementById("activityChart");
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
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            completed: [34, 42, 48, 44, 60, 55, 68, 72, 65, 86, 78, 92],
            progress: [20, 26, 28, 24, 37, 34, 42, 46, 39, 52, 48, 59]
        }
    };

    function renderActivityChart(period = "month") {
        if (typeof Chart === "undefined" || !chartCanvas) {
            const chartWrap = document.querySelector(".chart-wrap");

            chartWrap.textContent =
                "Chart library could not load. Check your internet connection.";

            return;
        }

        const selected = chartData[period] || chartData.month;

        if (activityChart) {
            activityChart.destroy();
        }

        activityChart = new Chart(chartCanvas, {
            type: "line",
            data: {
                labels: selected.labels,
                datasets: [
                    {
                        label: "Completed",
                        data: selected.completed,
                        borderColor: "#00D9FF",
                        backgroundColor: "rgba(0, 217, 255, 0.12)",
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2.5,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        pointBackgroundColor: "#FFFFFF",
                        pointBorderColor: "#00BFD9",
                        pointBorderWidth: 2
                    },
                    {
                        label: "In progress",
                        data: selected.progress,
                        borderColor: "#071A2B",
                        backgroundColor: "rgba(7, 26, 43, 0.025)",
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        pointBackgroundColor: "#FFFFFF",
                        pointBorderColor: "#071A2B",
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: "index"
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "#071A2B",
                        titleFont: {
                            family: "DM Sans",
                            size: 11
                        },
                        bodyFont: {
                            family: "DM Sans",
                            size: 10
                        },
                        padding: 11,
                        displayColors: true,
                        usePointStyle: true
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: "#8292A1",
                            font: {
                                family: "DM Sans",
                                size: 9
                            },
                            maxRotation: 0
                        }
                    },
                    y: {
                        beginAtZero: true,
                        border: {
                            display: false,
                            dash: [4, 4]
                        },
                        grid: {
                            color: "#EDF1F4",
                            drawTicks: false
                        },
                        ticks: {
                            color: "#8292A1",
                            padding: 9,
                            font: {
                                family: "DM Sans",
                                size: 9
                            },
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    renderActivityChart();

    document.getElementById("chartPeriod").addEventListener("change", (event) => {
        renderActivityChart(event.target.value);
    });

    /* =========================================
       CREATE PROJECT MODAL
    ========================================= */

    const createProjectButton =
        document.getElementById("createProjectButton");

    const closeModalButton = document.getElementById("closeModal");
    const cancelModalButton = document.getElementById("cancelModal");
    const projectNameInput = document.getElementById("newProjectName");

    function openProjectModal() {
        projectModal.classList.add("open");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        window.setTimeout(() => {
            projectNameInput.focus();
        }, 80);
    }

    function closeProjectModal() {
        projectModal.classList.remove("open");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    createProjectButton.addEventListener("click", openProjectModal);
    closeModalButton.addEventListener("click", closeProjectModal);
    cancelModalButton.addEventListener("click", closeProjectModal);

    projectModal.addEventListener("click", (event) => {
        if (event.target === projectModal) {
            closeProjectModal();
        }
    });

    function escapeHTML(value) {
        return value.replace(/[&<>"']/g, (character) => {
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

    newProjectForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = projectNameInput.value.trim();
        const owner = document.getElementById("newProjectOwner").value.trim();

        if (!name || !owner) {
            showToast("Please enter the project name and owner.");
            return;
        }

        const safeName = escapeHTML(name);
        const safeOwner = escapeHTML(owner);
        const initials = owner
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        const row = document.createElement("tr");
        row.dataset.status = "Planning";

        row.innerHTML = `
            <td>
                <div class="project-cell">
                    <span class="project-symbol symbol-cyan">
                        <i class="fa-solid fa-folder"></i>
                    </span>
                    <div>
                        <strong>${safeName}</strong>
                        <span>New project</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="owner-cell">
                    <span class="owner-avatar">${initials}</span>
                    <span>${safeOwner}</span>
                </div>
            </td>
            <td>
                <div class="progress-cell">
                    <div class="progress-track"><span></span></div>
                    <small>0%</small>
                </div>
            </td>
            <td>Not set</td>
            <td><span class="status-badge status-planning">Planning</span></td>
            <td>
                <button class="icon-button row-action" type="button"
                        aria-label="View ${safeName}"
                        data-project="${safeName}">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </button>
            </td>
        `;

        tableBody.prepend(row);
        projectNumber++;

        closeProjectModal();
        newProjectForm.reset();
        filterProjects();

        showToast(`"${name}" was added to this demo dashboard.`);
    });

    /* =========================================
       PROJECT ROW ACTIONS
    ========================================= */

    tableBody.addEventListener("click", (event) => {
        const button = event.target.closest("[data-project]");

        if (!button) return;

        showToast(
            `Selected "${button.dataset.project}". Connect a project details page to view full information.`
        );
    });

    /* =========================================
       EXPORT REPORT AS CSV
    ========================================= */

    document.getElementById("exportButton").addEventListener("click", () => {
        const rows = Array.from(
            tableBody.querySelectorAll("tr:not([hidden])")
        );

        const csvRows = [
            ["Project", "Owner", "Progress", "Deadline", "Status"]
        ];

        rows.forEach((row) => {
            const cells = row.querySelectorAll("td");

            if (cells.length < 5) return;

            const project = cells[0].innerText.trim().replace(/\n/g, " ");
            const owner = cells[1].innerText.trim().replace(/\n/g, " ");
            const progress = cells[2].innerText.trim().replace(/\n/g, " ");
            const deadline = cells[3].innerText.trim();
            const status = cells[4].innerText.trim();

            csvRows.push([project, owner, progress, deadline, status]);
        });

        const escapeCSV = (value) =>
            `"${String(value).replace(/"/g, '""')}"`;

        const csv = csvRows
            .map((row) => row.map(escapeCSV).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;"
        });

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

    /* =========================================
       NOTIFICATIONS AND PROFILE DEMOS
    ========================================= */

    document.getElementById("notificationButton").addEventListener("click", () => {
        showToast("You have workspace notifications. Connect your notification service to load real alerts.");
    });

    document.getElementById("topbarProfile").addEventListener("click", () => {
        showToast("LOT Admin profile selected. Connect your account settings page to manage your profile.");
    });

    document.getElementById("profileMenuButton").addEventListener("click", () => {
        showToast("Profile menu selected.");
    });

    document.getElementById("activityMore").addEventListener("click", () => {
        showToast("Activity options selected.");
    });

    /* =========================================
       CHECKLIST PROGRESS
    ========================================= */

    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");

    function updateTaskCount() {
        const checkboxes = taskList.querySelectorAll(
            'input[type="checkbox"]'
        );

        const completed = Array.from(checkboxes)
            .filter((checkbox) => checkbox.checked).length;

        taskCount.textContent = `${completed} / ${checkboxes.length}`;

        if (completed === checkboxes.length) {
            showToast("All checklist tasks are complete!");
        }
    }

    taskList.addEventListener("change", (event) => {
        if (event.target.matches('input[type="checkbox"]')) {
            updateTaskCount();
        }
    });

    updateTaskCount();

    /* =========================================
       INITIAL PROJECT COUNT
    ========================================= */

    filterProjects();
});
