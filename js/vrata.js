document.addEventListener("DOMContentLoaded", function () {

    const previousCard = document.getElementById("previous-vrata");
    const todayCard = document.getElementById("today-vrata");
    const nextCard = document.getElementById("next-vrata");

    const vrataCards = Array.from(
        document.querySelectorAll(".vrata-card[data-date]")
    );

    if (vrataCards.length === 0) {
        return;
    }


    /* =========================
       CREATE VRATA DATA
    ========================= */

    const vrataList = vrataCards.map(function (card) {

        const dateString = card.dataset.date;

        const date = new Date(dateString + "T00:00:00");

        return {
            card: card,
            date: date,
            dateString: dateString,
            dateText: card.querySelector(".vrata-date").textContent.trim(),
            name: card.querySelector("h2").textContent.trim()
        };

    });


    /* =========================
       SORT BY DATE
    ========================= */

    vrataList.sort(function (a, b) {
        return a.date - b.date;
    });


    /* =========================
       TODAY
    ========================= */

    const now = new Date();

    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );


    /* =========================
       FIND TODAY / PREVIOUS / NEXT
    ========================= */

    let previous = null;
    let todayVrata = null;
    let next = null;


    for (let i = 0; i < vrataList.length; i++) {

        if (vrataList[i].date.getTime() === today.getTime()) {

            todayVrata = vrataList[i];

            previous = vrataList[i - 1] || null;
            next = vrataList[i + 1] || null;

            break;
        }


        if (vrataList[i].date > today) {

            next = vrataList[i];

            previous = vrataList[i - 1] || null;

            break;
        }

    }


    /* =========================
       UPDATE HIGHLIGHT CARD
    ========================= */

    function updateCard(highlightCard, vrata) {

        if (!highlightCard) return;


        const dateElement =
            highlightCard.querySelector(".vrata-date");

        const nameElement =
            highlightCard.querySelector(".vrata-name");


        if (!vrata) {

            dateElement.textContent = "No Vrata";

            nameElement.textContent = "";

            return;
        }


        dateElement.textContent =
            vrata.dateText;

        nameElement.textContent =
            vrata.name;


        /* =========================
           CLICK → VRATA LIST
        ========================= */

        highlightCard.onclick = function () {

            vrata.card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        };


        highlightCard.style.cursor = "pointer";

    }


    /* =========================
       UPDATE ALL THREE
    ========================= */

    updateCard(
        previousCard,
        previous
    );


    updateCard(
        todayCard,
        todayVrata
    );


    updateCard(
        nextCard,
        next
    );

});


document.addEventListener("DOMContentLoaded", function () {

    const backButton = document.getElementById("back-to-vrata");

    if (backButton) {

        backButton.addEventListener("click", function () {

            window.location.href = "../listofvows.html";

        });

    }

});