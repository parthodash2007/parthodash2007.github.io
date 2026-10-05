/* =========================
   HERO SLIDESHOW
   16:9 + SMOOTH ONE-WAY ZOOM
========================= */

const heroCanvas = document.getElementById("hero-canvas");
const heroImages = document.querySelectorAll("#hero-images img");

if (heroCanvas && heroImages.length > 0) {

    const ctx = heroCanvas.getContext("2d");

    let currentImage = 0;
    let nextImage = 1;

    let slideStart = performance.now();

    const slideDuration = 6000;
    const transitionDuration = 1200;

    /*
       Each image gets only ONE zoom direction.

       true  = zoom in
       false = zoom out
    */

    const zoomDirections = heroImages.length
        ? Array.from(heroImages, (_, index) => index % 2 === 0)
        : [];


    /* =========================
       CANVAS SIZE
    ========================= */

    function resizeCanvas() {

        const rect =
            heroCanvas.getBoundingClientRect();

        const dpr =
            window.devicePixelRatio || 1;

        heroCanvas.width =
            rect.width * dpr;

        heroCanvas.height =
            rect.height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    /* =========================
       DRAW 16:9 COVER IMAGE
    ========================= */

    function drawImageCover(
        image,
        opacity,
        zoom
    ) {

        const rect =
            heroCanvas.getBoundingClientRect();

        const canvasWidth =
            rect.width;

        const canvasHeight =
            rect.height;


        const imageRatio =
            image.naturalWidth /
            image.naturalHeight;

        const canvasRatio =
            canvasWidth /
            canvasHeight;


        let width;
        let height;


        /*
           Make image cover the complete
           16:9 hero area.
        */

        if (imageRatio > canvasRatio) {

            height = canvasHeight;

            width =
                height * imageRatio;

        } else {

            width = canvasWidth;

            height =
                width / imageRatio;
        }


        /* =========================
           APPLY ZOOM
        ========================= */

        width *= zoom;
        height *= zoom;


        const x =
            (canvasWidth - width) / 2;

        const y =
            (canvasHeight - height) / 2;


        ctx.globalAlpha = opacity;


        ctx.drawImage(
            image,
            x,
            y,
            width,
            height
        );


        ctx.globalAlpha = 1;
    }


    /* =========================
       SMOOTH EASING
    ========================= */

    function easeInOut(t) {

        return t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }


    /* =========================
       ANIMATION
    ========================= */

    function animate(time) {

        const elapsed =
            time - slideStart;


        ctx.clearRect(
            0,
            0,
            heroCanvas.clientWidth,
            heroCanvas.clientHeight
        );


        /* =========================
           CURRENT IMAGE
        ========================= */

        if (elapsed < slideDuration) {

            let progress =
                elapsed / slideDuration;

            progress =
                easeInOut(progress);


            let zoom;


            /*
               Zoom IN
            */

            if (zoomDirections[currentImage]) {

                zoom =
                    1.00 +
                    (0.07 * progress);

            }

            /*
               Zoom OUT
            */

            else {

                zoom =
                    1.07 -
                    (0.07 * progress);
            }


            drawImageCover(
                heroImages[currentImage],
                1,
                zoom
            );
        }


        /* =========================
           FADE TO NEXT IMAGE
        ========================= */

        else {

            const transitionElapsed =
                elapsed - slideDuration;


            let transitionProgress =
                transitionElapsed /
                transitionDuration;


            transitionProgress =
                Math.min(
                    transitionProgress,
                    1
                );


            transitionProgress =
                easeInOut(
                    transitionProgress
                );


            /*
               Current image keeps
               its final zoom.
            */

            const currentZoom =
                zoomDirections[currentImage]
                    ? 1.07
                    : 1.00;


            /*
               Next image starts slightly
               zoomed and smoothly reaches
               its normal starting position.
            */

            const nextStartZoom =
                zoomDirections[nextImage]
                    ? 1.00
                    : 1.07;


            drawImageCover(
                heroImages[currentImage],
                1 - transitionProgress,
                currentZoom
            );


            drawImageCover(
                heroImages[nextImage],
                transitionProgress,
                nextStartZoom
            );


            /* =========================
               NEXT SLIDE
            ========================= */

            if (
                transitionProgress >= 1
            ) {

                currentImage =
                    nextImage;


                nextImage =
                    (nextImage + 1) %
                    heroImages.length;


                slideStart =
                    time;
            }
        }


        requestAnimationFrame(
            animate
        );
    }


    /* =========================
       RESIZE
    ========================= */

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /* =========================
       START
    ========================= */

    function startSlideshow() {

        resizeCanvas();

        slideStart =
            performance.now();

        requestAnimationFrame(
            animate
        );
    }


    if (heroImages[0].complete) {

        startSlideshow();

    } else {

        heroImages[0].addEventListener(
            "load",
            startSlideshow
        );
    }

}

/* =========================
   UPCOMING VRATA SCROLL
========================= */

const vrataSlider =
    document.querySelector(".home-vrata-slider");

const vrataLeftButton =
    document.querySelector(".vrata-scroll-left");

const vrataRightButton =
    document.querySelector(".vrata-scroll-right");


if (
    vrataSlider &&
    vrataLeftButton &&
    vrataRightButton
) {

    function getScrollAmount() {

        const card =
            vrataSlider.querySelector(".vrata-card");

        if (!card) return 0;

        const cardWidth =
            card.getBoundingClientRect().width;

        const sliderStyle =
            window.getComputedStyle(vrataSlider);

        const gap =
            parseFloat(sliderStyle.columnGap) || 0;

        return cardWidth + gap;
    }


    vrataLeftButton.addEventListener(
        "click",
        function () {

            vrataSlider.scrollBy({

                left: -getScrollAmount(),

                behavior: "smooth"

            });

        }
    );


    vrataRightButton.addEventListener(
        "click",
        function () {

            vrataSlider.scrollBy({

                left: getScrollAmount(),

                behavior: "smooth"

            });

        }
    );

}


/* =========================================
   AUTO UPDATE UPCOMING VRATAS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.querySelector(".home-vrata-slider");

    if (!slider) return;


    /* -----------------------------------------
       HOME PAGE VRATA CARDS
    ----------------------------------------- */

    const homeCards = Array.from(
        slider.querySelectorAll(".vrata-card")
    );


    /* -----------------------------------------
       GET VRATA LIST PAGE
    ----------------------------------------- */

    fetch("listofvows.html")
        .then(response => {

            if (!response.ok) {
                throw new Error("Could not load Vrata List");
            }

            return response.text();
        })

        .then(html => {

            const parser = new DOMParser();

            const documentFromList =
                parser.parseFromString(html, "text/html");


            /* -----------------------------------------
               GET ALL VRATA CARDS
            ----------------------------------------- */

            const allVratas = Array.from(
                documentFromList.querySelectorAll(".vrata-card")
            );


            /* -----------------------------------------
               CURRENT DATE
            ----------------------------------------- */

            const today = new Date();

            today.setHours(0, 0, 0, 0);


            /* -----------------------------------------
               FILTER UPCOMING VRATAS
            ----------------------------------------- */

            const upcomingVratas = allVratas
                .filter(card => {

                    const dateString =
                        card.getAttribute("data-date");

                    if (!dateString) return false;

                    const vrataDate =
                        new Date(dateString + "T00:00:00");

                    return vrataDate >= today;
                })


                /* -----------------------------------------
                   SORT BY DATE
                ----------------------------------------- */

                .sort((a, b) => {

                    const dateA =
                        new Date(
                            a.getAttribute("data-date")
                        );

                    const dateB =
                        new Date(
                            b.getAttribute("data-date")
                        );

                    return dateA - dateB;
                });


            /* -----------------------------------------
               FIRST 4 UPCOMING VRATAS
            ----------------------------------------- */

            const nextVratas =
                upcomingVratas.slice(0, 4);


            /* -----------------------------------------
               UPDATE HOME CARDS
            ----------------------------------------- */

            homeCards.forEach((homeCard, index) => {

                const sourceCard = nextVratas[index];

                if (!sourceCard) {

                    homeCard.style.display = "none";

                    return;
                }


                /* -----------------------------------------
                   SOURCE INFORMATION
                ----------------------------------------- */

                const sourceLink =
                    sourceCard.querySelector("a");

                const sourceDate =
                    sourceCard.querySelector(".vrata-date");

                const sourceName =
                    sourceCard.querySelector("h2");

                const sourceParana =
                    sourceCard.querySelector(".parana-time");


                /* -----------------------------------------
                   HOME CARD ELEMENTS
                ----------------------------------------- */

                const homeLink =
                    homeCard.querySelector("a");

                const homeDate =
                    homeCard.querySelector(".vrata-date");

                const homeName =
                    homeCard.querySelector("h2");

                const homeParana =
                    homeCard.querySelector(".parana-time");


                /* -----------------------------------------
                   UPDATE DATE
                ----------------------------------------- */

                if (sourceDate && homeDate) {

                    const dateText =
                        Array.from(
                            sourceDate.childNodes
                        )
                        .filter(node =>
                            node.nodeType === Node.TEXT_NODE
                        )
                        .map(node =>
                            node.textContent.trim()
                        )
                        .filter(Boolean)
                        .join(" ");

                    homeDate.lastChild.textContent =
                        " " + dateText;
                }


                /* -----------------------------------------
                   UPDATE NAME
                ----------------------------------------- */

                if (sourceName && homeName) {

                    homeName.textContent =
                        sourceName.textContent.trim();
                }


                /* -----------------------------------------
                   UPDATE PARANA TIME
                ----------------------------------------- */

                if (sourceParana && homeParana) {

                    const paranaText =
                        Array.from(
                            sourceParana.childNodes
                        )
                        .filter(node =>
                            node.nodeType === Node.TEXT_NODE
                        )
                        .map(node =>
                            node.textContent.trim()
                        )
                        .filter(Boolean)
                        .join(" ");

                    homeParana.lastChild.textContent =
                        " " + paranaText;
                }


                /* -----------------------------------------
                   UPDATE DATA DATE
                ----------------------------------------- */

                homeCard.dataset.date =
                    sourceCard.dataset.date;


                /* -----------------------------------------
                   UPDATE LINK
                ----------------------------------------- */

                if (sourceLink && homeLink) {

                    const sourceHref =
                        sourceLink.getAttribute("href");

                    if (sourceHref) {

                        homeLink.href =
                            new URL(
                                sourceHref,
                                window.location.href
                            ).href;
                    }
                }


                /* -----------------------------------------
                   SHOW CARD
                ----------------------------------------- */

                homeCard.style.display = "";
            });

        })


        /* -----------------------------------------
           ERROR
        ----------------------------------------- */

        .catch(error => {

            console.error(
                "Upcoming Vrata update failed:",
                error
            );

        });

});

/* =========================
   HOME PAGE BOOKS
   LOAD FROM BOOKS.HTML
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const bookSlider =
        document.getElementById("home-book-slider");

    if (!bookSlider) return;


    /*
        Load books.html
    */

    fetch("books.html")
        .then(response => response.text())
        .then(html => {

            const parser = new DOMParser();

            const documentHTML =
                parser.parseFromString(html, "text/html");


            const books =
                documentHTML.querySelectorAll(".book-card");


            books.forEach(book => {

                const link =
                    book.querySelector("a");

                const image =
                    book.querySelector("img");

                const name =
                    book.querySelector(".book-info h2");


                if (!link || !image || !name) return;


                const bookCard =
                    document.createElement("a");


                bookCard.className =
                    "home-book-card";


                /*
                    Book link
                */

                bookCard.href =
                    link.getAttribute("href");


                /*
                    Book image
                */

                const bookImage =
                    document.createElement("img");

                bookImage.src =
                    new URL(
                        image.getAttribute("src"),
                        window.location.href
                    ).href;

                bookImage.alt =
                    image.getAttribute("alt") || name.textContent.trim();


                /*
                    Book information
                */

                const bookInfo =
                    document.createElement("div");

                bookInfo.className =
                    "home-book-info";


                const bookName =
                    document.createElement("h3");

                bookName.textContent =
                    name.textContent.trim();


                bookInfo.appendChild(bookName);


                /*
                    Add everything
                */

                bookCard.appendChild(bookImage);
                bookCard.appendChild(bookInfo);

                bookSlider.appendChild(bookCard);

            });

        })
        .catch(error => {

            console.error(
                "Books could not be loaded:",
                error
            );

        });


    /* =========================
       SCROLL BUTTONS
    ========================= */

    const leftButton =
        document.querySelector(".book-scroll-left");

    const rightButton =
        document.querySelector(".book-scroll-right");


    function scrollBooks(direction) {

        const amount =
            bookSlider.clientWidth * 0.8;

        bookSlider.scrollBy({
            left: direction * amount,
            behavior: "smooth"
        });

    }


    if (leftButton) {

        leftButton.addEventListener(
            "click",
            function () {

                scrollBooks(-1);

            }
        );

    }


    if (rightButton) {

        rightButton.addEventListener(
            "click",
            function () {

                scrollBooks(1);

            }
        );

    }

});

/* =========================
   HOME PAGE — READ BOOKS
   AUTO BOOK SLIDER
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const bookSlider = document.getElementById("home-book-slider");

    if (!bookSlider) return;


    /* =========================
       LOAD BOOKS FROM books.html
    ========================= */

    fetch("books.html")
        .then(response => response.text())
        .then(html => {

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const books = doc.querySelectorAll(".book-card");

            if (!books.length) return;


            /* =========================
               COPY BOOK CARDS
            ========================= */

            books.forEach(book => {

                const clone = book.cloneNode(true);

                clone.classList.add("home-book-card");

                bookSlider.appendChild(clone);

            });


            /* =========================
               SCROLL BUTTONS
            ========================= */

            const leftButton =
                document.querySelector(".book-scroll-left");

            const rightButton =
                document.querySelector(".book-scroll-right");


            function getScrollAmount() {

                const card =
                    bookSlider.querySelector(".home-book-card");

                if (!card) return 0;

                const gap =
                    parseFloat(
                        getComputedStyle(bookSlider).gap
                    ) || 0;

                return card.offsetWidth + gap;
            }


            /* LEFT */

            if (leftButton) {

                leftButton.addEventListener("click", () => {

                    bookSlider.scrollBy({
                        left: -getScrollAmount(),
                        behavior: "smooth"
                    });

                });

            }


            /* RIGHT */

            if (rightButton) {

                rightButton.addEventListener("click", () => {

                    bookSlider.scrollBy({
                        left: getScrollAmount(),
                        behavior: "smooth"
                    });

                });

            }


            /* =========================
               AUTO SCROLL — EVERY 3 SEC
            ========================= */

            let autoScroll =
                setInterval(() => {

                    const maxScroll =
                        bookSlider.scrollWidth -
                        bookSlider.clientWidth;

                    if (bookSlider.scrollLeft >= maxScroll - 5) {

                        bookSlider.scrollTo({
                            left: 0,
                            behavior: "smooth"
                        });

                    } else {

                        bookSlider.scrollBy({
                            left: getScrollAmount(),
                            behavior: "smooth"
                        });

                    }

                }, 3000);


            /* =========================
               PAUSE WHILE MOUSE IS OVER
            ========================= */

            bookSlider.addEventListener(
                "mouseenter",
                () => clearInterval(autoScroll)
            );


            bookSlider.addEventListener(
                "mouseleave",
                () => {

                    autoScroll =
                        setInterval(() => {

                            const maxScroll =
                                bookSlider.scrollWidth -
                                bookSlider.clientWidth;

                            if (
                                bookSlider.scrollLeft >=
                                maxScroll - 5
                            ) {

                                bookSlider.scrollTo({
                                    left: 0,
                                    behavior: "smooth"
                                });

                            } else {

                                bookSlider.scrollBy({
                                    left: getScrollAmount(),
                                    behavior: "smooth"
                                });

                            }

                        }, 2000);

                }
            );

        })

        .catch(error => {

            console.error(
                "Books could not be loaded:",
                error
            );

        });

});

/* =========================
   HOME — BIOGRAPHIES SLIDER
   LOAD FROM biographies.html
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const slider =
        document.getElementById(
            "home-biography-slider"
        );

    if (!slider) return;


    /* =========================
       LOAD BIOGRAPHIES PAGE
    ========================= */

    fetch("biographies.html")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Could not load biographies.html"
                );
            }

            return response.text();

        })

        .then(html => {

            const parser =
                new DOMParser();

            const doc =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            /* =========================
               FIND ORIGINAL CARDS
            ========================= */

            const cards =
                doc.querySelectorAll(
                    ".biographies-grid .biography-card"
                );


            if (!cards.length) {

                console.error(
                    "No biography cards found."
                );

                return;
            }


            /* =========================
               COPY CARDS
            ========================= */

            cards.forEach(card => {

                const clone =
                    card.cloneNode(true);

                clone.classList.remove(
                    "biography-card"
                );

                clone.classList.add(
                    "home-biography-card"
                );

                slider.appendChild(clone);

            });


            /* =========================
               SCROLL AMOUNT
            ========================= */

            function getScrollAmount() {

                const card =
                    slider.querySelector(
                        ".home-biography-card"
                    );

                if (!card) return 0;


                const gap =
                    parseFloat(
                        getComputedStyle(slider).gap
                    ) || 0;


                return (
                    card.offsetWidth + gap
                );

            }


            /* =========================
               BUTTONS
            ========================= */

            const leftButton =
                document.querySelector(
                    ".biography-scroll-left"
                );

            const rightButton =
                document.querySelector(
                    ".biography-scroll-right"
                );


            if (leftButton) {

                leftButton.addEventListener(
                    "click",
                    () => {

                        slider.scrollBy({

                            left:
                                -getScrollAmount(),

                            behavior: "smooth"

                        });

                    }
                );

            }


            if (rightButton) {

                rightButton.addEventListener(
                    "click",
                    () => {

                        slider.scrollBy({

                            left:
                                getScrollAmount(),

                            behavior: "smooth"

                        });

                    }
                );

            }


            /* =========================
               AUTO SCROLL
               EVERY 3 SECONDS
            ========================= */

            let autoScroll =
                setInterval(
                    moveNext,
                    3000
                );


            function moveNext() {

                const maxScroll =
                    slider.scrollWidth -
                    slider.clientWidth;


                if (
                    slider.scrollLeft >=
                    maxScroll - 5
                ) {

                    slider.scrollTo({

                        left: 0,

                        behavior: "smooth"

                    });

                } else {

                    slider.scrollBy({

                        left:
                            getScrollAmount(),

                        behavior: "smooth"

                    });

                }

            }


            /* =========================
               USER INTERACTION
               STOPS AUTO SCROLL
            ========================= */

            let userInteracted = false;


            function stopAutoScroll() {

                if (userInteracted) return;

                userInteracted = true;

                clearInterval(autoScroll);

            }


            slider.addEventListener(
                "wheel",
                stopAutoScroll,
                { passive: true }
            );


            slider.addEventListener(
                "touchstart",
                stopAutoScroll,
                { passive: true }
            );


            slider.addEventListener(
                "pointerdown",
                stopAutoScroll
            );


            if (leftButton) {

                leftButton.addEventListener(
                    "click",
                    stopAutoScroll
                );

            }


            if (rightButton) {

                rightButton.addEventListener(
                    "click",
                    stopAutoScroll
                );

            }

        })

        .catch(error => {

            console.error(
                "Biographies could not be loaded:",
                error
            );

        });

});

/* =========================
   UPCOMING EVENTS SLIDER
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const eventSlider =
        document.querySelector(".home-events-slider");

    const leftButton =
        document.querySelector(".events-scroll-left");

    const rightButton =
        document.querySelector(".events-scroll-right");

    if (!eventSlider) return;


    /* =========================
       GET SCROLL AMOUNT
    ========================= */

    function getEventScrollAmount() {

        const slide =
            eventSlider.querySelector(".event-slide");

        if (!slide) return 0;

        return slide.getBoundingClientRect().width;
    }


    /* =========================
       MANUAL LEFT
    ========================= */

    if (leftButton) {

        leftButton.addEventListener("click", () => {

            eventSlider.scrollBy({
                left: -getEventScrollAmount(),
                behavior: "smooth"
            });

        });

    }


    /* =========================
       MANUAL RIGHT
    ========================= */

    if (rightButton) {

        rightButton.addEventListener("click", () => {

            eventSlider.scrollBy({
                left: getEventScrollAmount(),
                behavior: "smooth"
            });

        });

    }


    /* =========================
       AUTO SCROLL
       EVERY 3 SECONDS
    ========================= */

    let autoScrollTimer;


    function autoScroll() {

        autoScrollTimer = setInterval(() => {

            const amount =
                getEventScrollAmount();

            if (!amount) return;


            const maxScroll =
                eventSlider.scrollWidth -
                eventSlider.clientWidth;


            if (
                eventSlider.scrollLeft >=
                maxScroll - 5
            ) {

                eventSlider.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });

            } else {

                eventSlider.scrollBy({
                    left: amount,
                    behavior: "smooth"
                });

            }

        }, 3000);

    }


    /* =========================
       START AUTO SCROLL
    ========================= */

    autoScroll();


    /* =========================
       USER MANUAL SCROLL
       STOP AUTO SCROLL
    ========================= */

    function stopAutoScroll() {

        clearInterval(autoScrollTimer);

    }


    eventSlider.addEventListener(
        "wheel",
        stopAutoScroll,
        { passive: true }
    );


    eventSlider.addEventListener(
        "touchstart",
        stopAutoScroll,
        { passive: true }
    );


    eventSlider.addEventListener(
        "pointerdown",
        stopAutoScroll
    );


    if (leftButton) {

        leftButton.addEventListener(
            "click",
            stopAutoScroll
        );

    }


    if (rightButton) {

        rightButton.addEventListener(
            "click",
            stopAutoScroll
        );

    }

});