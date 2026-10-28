        const sidebar = document.getElementById("sidebar");
        const sidebarToggle = document.getElementById("sidebarToggle");

        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("sidebar-open");
        });

        document.addEventListener("click", (event) => {
            if (
                window.innerWidth <= 800 &&
                !sidebar.contains(event.target) &&
                !sidebarToggle.contains(event.target)
            ) {
                sidebar.classList.remove("sidebar-open");
            }
        });




        
document.addEventListener("DOMContentLoaded", function () {

    const mcqList = document.getElementById("mcqList");
    const scoreDisplay = document.getElementById("mcqScore");
    const resetButton = document.getElementById("resetQuiz");

    // Required elements check
    if (!mcqList || !scoreDisplay || !resetButton) return;

    let correctCount = 0;
    const completedQuestions = new Set();

    const questionCards = Array.from(
        mcqList.querySelectorAll(".mcq-card")
    );

    const totalQuestions = questionCards.length;

    // Wrong-answer audio file
    // Path is resolved relative to material.js
    const wrongSound = new Audio(
        new URL("./sounds/wrong.mp3", document.currentScript?.src ||
            document.querySelector('script[src*="material.js"]')?.src ||
            window.location.href).href
    );

    wrongSound.preload = "auto";
    wrongSound.volume = 0.7;

    function playWrongSound() {
        // Allow the same sound to replay quickly
        wrongSound.pause();
        wrongSound.currentTime = 0;

        wrongSound.play().catch(function (error) {
            console.warn("Unable to play wrong-answer sound:", error);
        });
    }

    function updateScore() {
        scoreDisplay.textContent =
            "Correct: " + correctCount + " / " + totalQuestions;
    }

    // Option selection
    mcqList.addEventListener("click", function (event) {

        const option = event.target.closest(".mcq-option");
        if (!option || !mcqList.contains(option)) return;

        const card = option.closest(".mcq-card");
        if (!card || completedQuestions.has(card) || option.disabled) return;

        const correctAnswer = card.dataset.answer;
        const selectedAnswer = option.dataset.option;
        const feedback = card.querySelector(".mcq-feedback");
        const allOptions = card.querySelectorAll(".mcq-option");

        if (selectedAnswer === correctAnswer) {

            // Correct answer: green, no sound
            option.classList.add("correct");

            if (feedback) {
                feedback.textContent = "✓ Correct answer!";
                feedback.className = "mcq-feedback success";
            }

            completedQuestions.add(card);
            correctCount++;

            allOptions.forEach(function (button) {
                button.disabled = true;
            });

            updateScore();

        } else {

            // Wrong answer: red + custom audio
            option.classList.add("wrong");

            if (feedback) {
                feedback.textContent =
                    "✗ Incorrect. Try another option.";
                feedback.className = "mcq-feedback error";
            }

            playWrongSound();

            // Disable only the selected wrong option
            option.disabled = true;
        }
    });

    // Show / hide correct answer
    mcqList.addEventListener("click", function (event) {

        const toggleButton = event.target.closest(".answer-toggle");
        if (!toggleButton || !mcqList.contains(toggleButton)) return;

        const card = toggleButton.closest(".mcq-card");
        if (!card) return;

        const answer = card.querySelector(".answer-reveal");
        if (!answer) return;

        const isVisible = answer.classList.toggle("visible");

        toggleButton.textContent = isVisible
            ? "Hide Answer"
            : "Show Answer";
    });

    // Reset quiz
    resetButton.addEventListener("click", function () {

        correctCount = 0;
        completedQuestions.clear();

        questionCards.forEach(function (card) {

            card.querySelectorAll(".mcq-option").forEach(
                function (option) {
                    option.disabled = false;
                    option.classList.remove("wrong", "correct");
                }
            );

            const feedback = card.querySelector(".mcq-feedback");

            if (feedback) {
                feedback.textContent = "";
                feedback.className = "mcq-feedback";
            }

            const answer = card.querySelector(".answer-reveal");

            if (answer) {
                answer.classList.remove("visible");
            }

            const toggleButton = card.querySelector(".answer-toggle");

            if (toggleButton) {
                toggleButton.textContent = "Show Answer";
            }
        });

        // Stop any currently playing wrong-answer sound
        wrongSound.pause();
        wrongSound.currentTime = 0;

        updateScore();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    updateScore();

});
