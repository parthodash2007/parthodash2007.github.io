document.addEventListener("DOMContentLoaded", function () {

    // তোমার অন্যান্য JavaScript code


    /* =========================
       BACK TO BLOG
    ========================= */

    const backToBlog =
        document.getElementById("back-to-blog");

    if (backToBlog) {

        backToBlog.addEventListener(
            "click",
            function () {

                window.history.back();

            }
        );

    }

      /* =========================
       BACK TO BIOGRAPHIES
    ========================= */

    const backToBiographies =
        document.getElementById("back-to-biographies");

    if (backToBiographies) {

        backToBiographies.addEventListener(
            "click",
            function () {

                window.history.back();

            }
        );

    } 
    

});