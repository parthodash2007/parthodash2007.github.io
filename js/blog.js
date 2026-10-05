document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       BLOG POSTS
    ========================= */

    const blogPosts =
        document.querySelectorAll(".blog-post");

            /* =========================
       BLOG PAGINATION
    ========================= */

    const postsPerPage = 10;

    const pagination =
        document.getElementById("blog-pagination");

    const totalPosts =
        blogPosts.length;

    const totalPages =
        Math.ceil(totalPosts / postsPerPage);


    /* =========================
       GET CURRENT PAGE
    ========================= */

    const urlParams =
        new URLSearchParams(window.location.search);

    let currentPage =
        parseInt(urlParams.get("page")) || 1;


    if (currentPage < 1) {
        currentPage = 1;
    }

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }


    /* =========================
       SHOW POSTS
    ========================= */

    blogPosts.forEach(function (post, index) {

        const postPage =
            Math.floor(index / postsPerPage) + 1;


        if (postPage === currentPage) {

            post.style.display = "";

        } else {

            post.style.display = "none";

        }

    });


    /* =========================
       CREATE PAGINATION
    ========================= */

    if (pagination && totalPages > 1) {

        pagination.innerHTML = "";


        /* =========================
           PREVIOUS BUTTON
        ========================= */

        if (currentPage > 1) {

            const previousButton =
                document.createElement("a");

            previousButton.href =
                "?page=" + (currentPage - 1);

            previousButton.className =
                "pagination-button pagination-prev";

            previousButton.innerHTML =
                '<i class="fa-solid fa-angle-left"></i> Previous';

            pagination.appendChild(
                previousButton
            );

        }


        /* =========================
           PAGE NUMBERS
        ========================= */

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            const pageButton =
                document.createElement("a");


            pageButton.href =
                "?page=" + page;


            pageButton.className =
                "pagination-button";


            if (page === currentPage) {

                pageButton.classList.add(
                    "active"
                );

            }


            pageButton.textContent =
                page;


            pagination.appendChild(
                pageButton
            );

        }


        /* =========================
           NEXT BUTTON
        ========================= */

        if (currentPage < totalPages) {

            const nextButton =
                document.createElement("a");


            nextButton.href =
                "?page=" + (currentPage + 1);


            nextButton.className =
                "pagination-button pagination-next";


            nextButton.innerHTML =
                'Next <i class="fa-solid fa-angle-right"></i>';


            pagination.appendChild(
                nextButton
            );

        }

    }


    blogPosts.forEach(function (post) {

        /* =========================
           SHARE INFORMATION
        ========================= */

        const facebookButton =
            post.querySelector(".facebook-share");

        const whatsappButton =
            post.querySelector(".whatsapp-share");

        const copyButton =
            post.querySelector(".copy-share");


        const pageURL =
            window.location.href;


        const titleElement =
            post.querySelector(".post-header h2");


        const postTitle =
            titleElement
                ? titleElement.textContent.trim()
                : document.title;


        /* =========================
           FACEBOOK SHARE
        ========================= */

        if (facebookButton) {

            facebookButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const facebookURL =
                        "https://www.facebook.com/sharer/sharer.php?u=" +
                        encodeURIComponent(pageURL);


                    window.open(
                        facebookURL,
                        "_blank",
                        "width=600,height=500"
                    );

                }
            );

        }


        /* =========================
           WHATSAPP SHARE
        ========================= */

        if (whatsappButton) {

            whatsappButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const message =
                        postTitle +
                        "\n\n" +
                        pageURL;


                    const whatsappURL =
                        "https://wa.me/?text=" +
                        encodeURIComponent(message);


                    window.open(
                        whatsappURL,
                        "_blank"
                    );

                }
            );

        }


        /* =========================
           COPY LINK
        ========================= */

        if (copyButton) {

            copyButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    if (navigator.clipboard) {

                        navigator.clipboard
                            .writeText(pageURL)

                            .then(function () {

                                showCopiedMessage(
                                    copyButton
                                );

                            })

                            .catch(function () {

                                fallbackCopy(
                                    pageURL,
                                    copyButton
                                );

                            });

                    } else {

                        fallbackCopy(
                            pageURL,
                            copyButton
                        );

                    }

                }
            );

        }


        /* =========================
           MEDIA GALLERY
        ========================= */

        const mediaContainer =
            post.querySelector(".post-media");


        if (mediaContainer) {

            const mediaItems =
                Array.from(
                    mediaContainer.querySelectorAll(
                        "img, iframe, video"
                    )
                );


            const mediaCount =
                mediaItems.length;


            /* =========================
               REMOVE OLD CLASSES
            ========================= */

            mediaContainer.classList.remove(
                "single-media",
                "media-gallery",
                "gallery-2",
                "gallery-3",
                "gallery-4",
                "gallery-many"
            );


            /* =========================
               REMOVE OLD GALLERY ELEMENTS
            ========================= */

            mediaContainer
                .querySelectorAll(
                    ".gallery-more, .gallery-item"
                )
                .forEach(function (element) {

                    element.remove();

                });


            /*
                Re-read original media elements
                after removing old wrappers.
            */

            const freshMediaItems =
                Array.from(
                    mediaContainer.querySelectorAll(
                        "img, iframe, video"
                    )
                );


            const count =
                freshMediaItems.length;


            /* =========================
               SINGLE MEDIA
            ========================= */

            if (count === 1) {

                mediaContainer.classList.add(
                    "single-media"
                );


                const media =
                    freshMediaItems[0];


                media.classList.add(
                    "single-media-element"
                );


                addMediaClick(
                    media,
                    freshMediaItems,
                    0,
                    post
                );

            }


            /* =========================
               MULTIPLE MEDIA
            ========================= */

            else if (count > 1) {

                mediaContainer.classList.add(
                    "media-gallery"
                );


                /* =========================
                   GALLERY TYPE
                ========================= */

                if (count === 2) {

                    mediaContainer.classList.add(
                        "gallery-2"
                    );

                }

                else if (count === 3) {

                    mediaContainer.classList.add(
                        "gallery-3"
                    );

                }

                else if (count === 4) {

                    mediaContainer.classList.add(
                        "gallery-4"
                    );

                }

                else if (count > 4) {

                    mediaContainer.classList.add(
                        "gallery-many"
                    );

                }


                /* =========================
                   CREATE GALLERY ITEMS
                ========================= */

                freshMediaItems.forEach(
                    function (media, index) {

                        const wrapper =
                            document.createElement("div");


                        wrapper.className =
                            "gallery-item";


                        /*
                           Move media into wrapper
                        */

                        media.parentNode.insertBefore(
                            wrapper,
                            media
                        );


                        wrapper.appendChild(
                            media
                        );


                        /* =========================
                           HIDE MEDIA AFTER 4
                        ========================= */

                        if (
                            count > 4 &&
                            index > 3
                        ) {

                            wrapper.classList.add(
                                "gallery-hidden"
                            );

                        }


                        /* =========================
                           CLICK TO OPEN VIEWER
                        ========================= */

                        addMediaClick(
                            media,
                            freshMediaItems,
                            index,
                            post
                        );

                    }
                );


                /* =========================
                   +N OVERLAY
                ========================= */

                if (count > 4) {

                    const fourthItem =
                        mediaContainer.querySelectorAll(
                            ".gallery-item"
                        )[3];


                    if (fourthItem) {

                        const overlay =
                            document.createElement("div");


                        overlay.className =
                            "gallery-more";


                        overlay.textContent =
                            "+" + (count - 4);


                        fourthItem.appendChild(
                            overlay
                        );


                        /*
                           Clicking +N opens
                           the gallery viewer.
                        */

                        overlay.addEventListener(
                            "click",
                            function (event) {

                                event.preventDefault();
                                event.stopPropagation();


                                openMediaViewer(
                                    freshMediaItems,
                                    3,
                                    post
                                );

                            }
                        );

                    }

                }

            }

        }

    });


    /* =========================
       MEDIA CLICK
    ========================= */

    function addMediaClick(
        media,
        allMedia,
        index,
        post
    ) {

        media.addEventListener(
            "click",
            function (event) {

                /*
                   Do not open viewer when
                   clicking video controls.
                */

                if (
                    media.tagName.toLowerCase() ===
                    "video"
                ) {

                    const rect =
                        media.getBoundingClientRect();


                    const controlHeight = 55;


                    const clickFromBottom =
                        rect.bottom -
                        event.clientY;


                    if (
                        clickFromBottom <
                        controlHeight
                    ) {

                        return;

                    }

                }


                event.preventDefault();


                openMediaViewer(
                    allMedia,
                    index,
                    post
                );

            }
        );

    }


    /* =========================
       MEDIA VIEWER
    ========================= */

    function openMediaViewer(
        mediaItems,
        startIndex,
        post
    ) {

        /*
           Remove existing viewer
        */

        const oldViewer =
            document.querySelector(
                ".media-viewer"
            );


        if (oldViewer) {

            oldViewer.remove();

        }


        let currentIndex =
            startIndex;


        /* =========================
           VIEWER
        ========================= */

        const viewer =
            document.createElement("div");


        viewer.className =
            "media-viewer";


        viewer.innerHTML = `

            <button
                type="button"
                class="media-viewer-close"
                aria-label="Close"
            >
                &times;
            </button>

            <button
                type="button"
                class="media-viewer-prev"
                aria-label="Previous"
            >
                &#10094;
            </button>

            <div class="media-viewer-content"></div>

            <button
                type="button"
                class="media-viewer-next"
                aria-label="Next"
            >
                &#10095;
            </button>

            <div class="media-viewer-counter"></div>

        `;


        document.body.appendChild(
            viewer
        );


        const content =
            viewer.querySelector(
                ".media-viewer-content"
            );


        const closeButton =
            viewer.querySelector(
                ".media-viewer-close"
            );


        const previousButton =
            viewer.querySelector(
                ".media-viewer-prev"
            );


        const nextButton =
            viewer.querySelector(
                ".media-viewer-next"
            );


        const counter =
            viewer.querySelector(
                ".media-viewer-counter"
            );


        /* =========================
           SHOW MEDIA
        ========================= */

        function showMedia(index) {

            currentIndex =
                index;


            content.innerHTML =
                "";


            const original =
                mediaItems[currentIndex];


            if (!original) {

                return;

            }


            const tag =
                original.tagName.toLowerCase();


            let clone;


            /* =========================
               IMAGE
            ========================= */

            if (tag === "img") {

                clone =
                    document.createElement(
                        "img"
                    );


                clone.src =
                    original.src;


                clone.alt =
                    original.alt || "";


                clone.className =
                    "viewer-image";

            }


            /* =========================
               VIDEO
            ========================= */

            else if (tag === "video") {

                clone =
                    document.createElement(
                        "video"
                    );


                clone.src =
                    original.currentSrc ||
                    original.src;


                clone.controls =
                    true;


                clone.autoplay =
                    false;


                clone.playsInline =
                    true;


                clone.className =
                    "viewer-video";

            }


            /* =========================
               IFRAME
            ========================= */

            else if (tag === "iframe") {

                clone =
                    document.createElement(
                        "iframe"
                    );


                clone.src =
                    original.src;


                clone.title =
                    original.title || "Media";


                clone.allow =
                    original.allow || "";


                clone.setAttribute(
                    "allowfullscreen",
                    ""
                );


                clone.className =
                    "viewer-iframe";

            }


            if (clone) {

                content.appendChild(
                    clone
                );

            }


            /* =========================
               COUNTER
            ========================= */

            counter.textContent =
                (currentIndex + 1) +
                " / " +
                mediaItems.length;


            /* =========================
               BUTTON VISIBILITY
            ========================= */

            if (
                mediaItems.length <= 1
            ) {

                previousButton.style.display =
                    "none";


                nextButton.style.display =
                    "none";

            }

            else {

                previousButton.style.display =
                    "flex";


                nextButton.style.display =
                    "flex";

            }

        }


        /* =========================
           PREVIOUS
        ========================= */

        previousButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                currentIndex =
                    (
                        currentIndex -
                        1 +
                        mediaItems.length
                    ) %
                    mediaItems.length;


                showMedia(
                    currentIndex
                );

            }
        );


        /* =========================
           NEXT
        ========================= */

        nextButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                currentIndex =
                    (
                        currentIndex +
                        1
                    ) %
                    mediaItems.length;


                showMedia(
                    currentIndex
                );

            }
        );


        /* =========================
           CLOSE
        ========================= */

        closeButton.addEventListener(
            "click",
            function () {

                viewer.remove();

                document.body
                    .classList.remove(
                        "media-viewer-open"
                    );

            }
        );


        /* =========================
           BACKGROUND CLICK
        ========================= */

        viewer.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    viewer
                ) {

                    viewer.remove();

                    document.body
                        .classList.remove(
                            "media-viewer-open"
                        );

                }

            }
        );


        /* =========================
           KEYBOARD
        ========================= */

        function keyboardHandler(
            event
        ) {

            if (
                !document.body.contains(
                    viewer
                )
            ) {

                document.removeEventListener(
                    "keydown",
                    keyboardHandler
                );

                return;

            }


            if (
                event.key === "Escape"
            ) {

                viewer.remove();

                document.body
                    .classList.remove(
                        "media-viewer-open"
                    );

            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousButton.click();

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextButton.click();

            }

        }


        document.addEventListener(
            "keydown",
            keyboardHandler
        );


        /* =========================
           OPEN
        ========================= */

        document.body.classList.add(
            "media-viewer-open"
        );


        showMedia(
            currentIndex
        );

    }


    /* =========================
       COPIED MESSAGE
    ========================= */

    function showCopiedMessage(
        button
    ) {

        const originalHTML =
            button.innerHTML;


        button.innerHTML =
            '<i class="fa-solid fa-check"></i> Copied';


        setTimeout(
            function () {

                button.innerHTML =
                    originalHTML;

            },
            2000
        );

    }


    /* =========================
       COPY FALLBACK
    ========================= */

    function fallbackCopy(
        text,
        button
    ) {

        const input =
            document.createElement(
                "input"
            );


        input.value =
            text;


        document.body.appendChild(
            input
        );


        input.select();


        input.setSelectionRange(
            0,
            99999
        );


        try {

            document.execCommand(
                "copy"
            );


            showCopiedMessage(
                button
            );

        }

        catch (error) {

            alert(
                "Unable to copy link."
            );

        }


        document.body.removeChild(
            input
        );

    }

});