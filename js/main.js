const header = document.getElementById("site-header");

let lastScrollPosition = window.scrollY;

window.addEventListener("scroll", () => {

    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
        // Scrolling down
        header.classList.add("header-hidden");
    } else {
        // Scrolling up
        header.classList.remove("header-hidden");
    }

    lastScrollPosition = currentScrollPosition;

});

const searchPages = [

    {
        title: "Home",
        url: "home.html",
        content: "Radha Krishna Vaishnava devotional website, Krishna, Radha, devotion, spiritual teachings."
    },

    {
        title: "Books",
        url: "books.html",
        content: "Religious books, scriptures, Essential Daily Mantras, Vaishnava literature and spiritual books."
    },

    {
        title: "Blog",
        url: "blog.html",
        content: "Devotional articles, Krishna consciousness, Vaishnava teachings, spiritual thoughts and religious posts."
    },

    {
        title: "Vrata List",
        url: "listofvows.html",
        content: "Vaishnava Vrata list, Ekadashi, Janmashtami, Radhastami and other religious observances."
    },

    {
        title: "Connect With Us",
        url: "connectwithus.html",
        content: "YouTube, Facebook and other social media links."
    }

];

const resultsContainer = document.getElementById("results-container");
const searchQuery = document.getElementById("search-query");

if (resultsContainer && searchQuery) {

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    if (query) {

        const searchTerm = query.toLowerCase().trim();

        searchQuery.textContent = `Search results for "${query}"`;

        const results = searchPages.filter(page =>
            page.title.toLowerCase().includes(searchTerm) ||
            page.content.toLowerCase().includes(searchTerm)
        );

        if (results.length > 0) {

            results.forEach(page => {

                const result = document.createElement("article");

                result.className = "search-result";

                result.innerHTML = `
                    <h2>${page.title}</h2>
                    <p>${page.content}</p>
                    <a href="${page.url}">Read More →</a>
                `;

                resultsContainer.appendChild(result);

            });

        } else {

            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h2>No results found</h2>
                    <p>Sorry, we couldn't find anything matching your search.</p>
                </div>
            `;

        }

    } else {

        searchQuery.textContent = "Enter a search term to find content.";

    }

}



document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener("click", function () {

        mainNav.classList.toggle("menu-open");

        const isOpen = mainNav.classList.contains("menu-open");

        menuToggle.setAttribute("aria-expanded", isOpen);

        if (isOpen) {
            menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            menuToggle.setAttribute("aria-label", "Close navigation menu");
        } else {
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }

    });

    // Menu item click করলে mobile menu বন্ধ হবে
    mainNav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {
            mainNav.classList.remove("menu-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });

    });

});
