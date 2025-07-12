const flamesMeanings = {
    F: "Friends",
    L: "Lovers",
    A: "Affection",
    M: "Marriage",
    E: "Enemies",
    S: "Siblings",
};

let currentNames = { name1: "", name2: "" };
let gameInProgress = false;

const name1Input = document.getElementById("name1");
const name2Input = document.getElementById("name2");
const inputArea = document.getElementById("inputArea");
const gameArea = document.getElementById("gameArea");
const resultDisplay = document.getElementById("resultDisplay");
const resultText = document.getElementById("resultText");
const processDisplay = document.getElementById("processDisplay");
const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");

function showMessage(message) {
    messageText.textContent = message;
    messageBox.classList.remove("hidden");
}

function hideMessage() {
    messageBox.classList.add("hidden");
}

function startGame() {
    hideMessage();
    const name1 = name1Input.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z]/g, "");
    const name2 = name2Input.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z]/g, "");

    if (!name1 || !name2) {
        showMessage("Please enter both names!");
        return;
    }

    if (name1 === name2) {
        showMessage("Names cannot be the same. Try a nickname!");
        return;
    }

    currentNames = { name1: name1, name2: name2 };
    gameInProgress = true;

    inputArea.classList.add("hidden");
    gameArea.classList.remove("hidden");

    resetFlamesLetters();
    playFlamesGame(name1, name2);
}

function resetFlamesLetters() {
    const letters = document.querySelectorAll("#flamesContainer span");
    letters.forEach((letter) => {
        letter.className =
            "text-5xl md:text-7xl font-bold text-slate-800 transition-all duration-500";
    });
    resultDisplay.classList.add("hidden");
    resultText.textContent = "";
}

function playFlamesGame(name1, name2) {
    let tempName1 = name1.split("");
    let tempName2 = name2.split("");

    for (let i = 0; i < tempName1.length; i++) {
        for (let j = 0; j < tempName2.length; j++) {
            if (tempName1[i] === tempName2[j]) {
                tempName1.splice(i, 1);
                tempName2.splice(j, 1);
                i--;
                break;
            }
        }
    }

    const remainingCount = tempName1.length + tempName2.length;

    if (remainingCount === 0) {
        showMessage("The names cancel each other out! Try different names.");
        resetGame();
        return;
    }

    eliminateLetters(remainingCount);
}

function eliminateLetters(count) {
    const flames = ["F", "L", "A", "M", "E", "S"];
    let currentIndex = 0;

    const eliminationDelay = 700;

    function eliminateNext() {
        if (flames.length === 1) {
            showResult(flames[0]);
            return;
        }

        currentIndex = (currentIndex + count - 1) % flames.length;
        const letterToEliminate = flames[currentIndex];

        flames.splice(currentIndex, 1);

        animateElimination(letterToEliminate);

        setTimeout(eliminateNext, eliminationDelay);
    }

    setTimeout(eliminateNext, 1000);
}

function animateElimination(letter) {
    const letterElement = document.querySelector(`[data-letter="${letter}"]`);
    if (letterElement) {
        letterElement.classList.add("text-slate-400", "scale-75");
        letterElement.classList.add("slanted-strike");
    }
}

function showResult(finalLetter) {
    const letterElement = document.querySelector(
        `[data-letter="${finalLetter}"]`
    );

    if (letterElement) {
        letterElement.classList.remove("slanted-strike", "text-slate-400");
        letterElement.className =
            "text-5xl md:text-7xl font-bold fire-text glow-animation transition-all duration-500";
    }

    setTimeout(() => {
        const meaning = flamesMeanings[finalLetter];
        const name1Formatted =
            currentNames.name1.charAt(0).toUpperCase() +
            currentNames.name1.slice(1);
        const name2Formatted =
            currentNames.name2.charAt(0).toUpperCase() +
            currentNames.name2.slice(1);

        resultText.innerHTML = `
                    ${name1Formatted} & ${name2Formatted} are <span class="fire-text uppercase">${meaning}</span>!
                `;
        resultDisplay.classList.remove("hidden");

        gameInProgress = false;
    }, 1000);
}

function resetGame() {
    gameInProgress = false;
    hideMessage();
    gameArea.classList.add("hidden");
    inputArea.classList.remove("hidden");
    name1Input.value = "";
    name2Input.value = "";
    resetFlamesLetters();
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !gameInProgress) {
        if (
            document.activeElement === name1Input ||
            document.activeElement === name2Input
        ) {
            startGame();
        }
    }
});
