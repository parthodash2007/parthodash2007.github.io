
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. MAIN PAGE: SUBJECT SEARCH
    // =====================================

    const searchInput = document.getElementById("subjectSearch");
    const searchButton = document.getElementById("searchButton");
    const subjectCards = document.querySelectorAll(".subject-card");
    const subjectCount = document.getElementById("subjectCount");
    const noResults = document.getElementById("noResults");

    function searchSubjects() {
        if (!searchInput || subjectCards.length === 0) return;

        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        subjectCards.forEach(card => {
            const searchableText = (
                card.innerText + " " +
                (card.dataset.search || "")
            ).toLowerCase();

            const matches = searchableText.includes(query);

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }
        });

        if (subjectCount) {
            subjectCount.textContent =
                `${visibleCount} Subject${visibleCount !== 1 ? "s" : ""}`;
        }

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", searchSubjects);

        searchInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                searchSubjects();
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener("click", searchSubjects);
    }


    // =====================================
    // 2. MOBILE: MAIN PAGE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("nav-open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("nav-open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });
        });
    }


    // =====================================
    // 3. SUBJECT PAGES: MOBILE SIDEBAR
    // =====================================

    const sidebar = document.getElementById("sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            const isOpen = sidebar.classList.toggle("sidebar-open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        sidebar.querySelectorAll(".subject-nav-link").forEach(link => {
            link.addEventListener("click", () => {
                sidebar.classList.remove("sidebar-open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });
        });
    }


    // =====================================
    // 4. FOOTER: CURRENT YEAR
    // =====================================

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

});

