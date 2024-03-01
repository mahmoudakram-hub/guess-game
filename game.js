/** @format */

let gameName = "Guess The Word";

document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Created by Mahmoud`;

//.. Game sitting

let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;
let goldenWords = [];

// list of words
let wordToGuess = "";
const words = [
    "Create",
    "Updata",
    "Delete",
    "Master",
    "Branch",
    "Mainly",
    "Elzero",
    "School",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
console.log(wordToGuess);

// Manage Hints
const innerHint = document.querySelector(".hint span");
innerHint.innerHTML = numberOfHints;
const HintBtn = document.querySelector(".hint");
HintBtn.addEventListener("click", getHint);

//generate the needed input
function generatInputs() {
    const inputBox = document.querySelector(".inputs");
    inputBox.innerHTML = "";
    for (let i = 1; i <= numberOfTries; i++) {
        let tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span> Try ${i} </span>`;
        if (i !== currentTry) tryDiv.classList.add("disabled-input");
        for (let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input");
            input.id = `try-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            input.type = "text";
            tryDiv.appendChild(input);
        }

        inputBox.appendChild(tryDiv);
    }
    // focus on the first input in the first try
    inputBox.children[currentTry - 1].children[1].focus();

    // disabled all inputs except first one
    const disabledInputs = document.querySelectorAll(".disabled-input input");
    disabledInputs.forEach((element) => (element.disabled = true));

    // move to the next input when type a letter
    const inputs = document.querySelectorAll("input");

    inputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
            let nextInput = inputs[index + 1];
            if (nextInput) inputs[index + 1].focus();
        });

        input.addEventListener("keydown", function (event) {
            const currentInputIndex = Array.from(inputs).indexOf(this); // event.target
            if (event.key === "ArrowRight") {
                const nextInput = inputs[currentInputIndex + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
            if (event.key === "ArrowLeft") {
                const prevInput = inputs[currentInputIndex - 1];
                if (prevInput) {
                    prevInput.focus();
                }
            }
        });
    });
}

const checkBtn = document.querySelector(".check");
checkBtn.addEventListener("click", guessCheck);
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        guessCheck();
    }
});

function guessCheck() {
    let success = true;
    console.log("worked");

    for (let i = 1; i <= numberOfLetters; i++) {
        const input = document.querySelector(`#try-${currentTry}-letter-${i}`);
        const inputValue = input.value.toLowerCase();

        if (inputValue === wordToGuess[i - 1]) {
            input.classList.add("in-place");
        } else if (wordToGuess.includes(inputValue) && inputValue !== "") {
            input.classList.add("not-in-place");
            success = false;
        } else {
            input.classList.add("wrong");
            success = false;
        }
    }
    const messageArea = document.querySelector(".message");

    const currentTryDiv = document.querySelector(`.try-${currentTry}`);
    const currentTryInputs = document.querySelectorAll(
        `.try-${currentTry} > input`
    );

    currentTryDiv.classList.add("disabled-input");
    currentTryInputs.forEach((input) => {
        input.disabled = true;
    });

    if (success) {
        messageArea.innerHTML = `you win ,the word is <span>${wordToGuess}</span> `;
        if (numberOfHints === 2) {
            messageArea.innerHTML = `<span>congratulations</span><p>you disn't use the hints </p>`;
        }
        checkBtn.disabled = true;
        HintBtn.disabled = true;
    } else {
        currentTry++;
        const currentTryDiv = document.querySelector(`.try-${currentTry}`);
        const currentTryInputs = document.querySelectorAll(
            `.try-${currentTry} > input`
        );
        if (currentTry > numberOfTries) {
            messageArea.innerHTML = `you lose ,the word is <span>${wordToGuess}</span> `;
            checkBtn.disabled = true;
            HintBtn.disabled = true;
            console.log(currentTry);
        } else {
            currentTryDiv.classList.remove("disabled-input");
            currentTryInputs.forEach((input, index) => {
                input.disabled = false;
                index === 0 ? input.focus() : null;
            });
        }
    }
    plus.disabled = true;
    minus.disabled = true;
    goldenBtn.disabled = true;
}

//Handle Backspace
function handleBackspace(event) {
    if (event.key === "Backspace") {
        const inputs = Array.from(
            document.querySelectorAll(".inputs > div input:not([disabled])")
        );

        const currentIndex = inputs.indexOf(document.activeElement);

        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            if (currentInput.value === "") {
                inputs[currentIndex - 1].value = "";
                inputs[currentIndex - 1].focus();
            } else {
                currentInput.value = "";
            }
        }
        console.log(currentIndex);
    }
}
document.addEventListener("keydown", handleBackspace);

// Handle Hints
function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        innerHint.innerHTML = numberOfHints;
    }
    if (numberOfHints === 0) {
        HintBtn.disabled = true;
    }

    const enableIntputs = document.querySelectorAll(
        ".inputs > div input:not([disabled])"
    );

    const emptyEnableInpts = Array.from(enableIntputs).filter(
        (input) => input.value === ""
    );

    if (emptyEnableInpts.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnableInpts.length);
        const randomInput = emptyEnableInpts[randomIndex];
        const indexToFill = Array.from(enableIntputs).indexOf(randomInput);
        randomInput.value = wordToGuess[indexToFill].toUpperCase();
        console.log(indexToFill);
        console.log(randomIndex);
    }
}

//handle number of tries

const plus = document.querySelector(".tries-number .plus");
const minus = document.querySelector(".tries-number .minus");
const triesSpan = document.querySelector(".tries-number .tries");

triesSpan.innerHTML = numberOfTries;
const messageArea = document.querySelector(".message");

// increase the number of tries
plus.addEventListener("click", () => {
    if (numberOfTries < 6) {
        numberOfTries++;
        triesSpan.innerHTML = numberOfTries;
        generatInputs();
        messageArea.innerHTML = "";
    }
    if (numberOfTries === 6) {
        messageArea.innerHTML = "<p>you cann't add more that 6";
    }
});

// decrease the number of tries
minus.addEventListener("click", () => {
    if (numberOfTries > 2) {
        numberOfTries--;
        triesSpan.innerHTML = numberOfTries;
        generatInputs();
        messageArea.innerHTML = "";
    }
    if (numberOfTries === 2) {
        messageArea.innerHTML = "<p>you cann't go less that 2";
    }
});

// handle Golden Challange
const goldenBtn = document.querySelector(".golden");
const dialog = document.querySelector(".dialog");
const wordsDiv = document.querySelector(".dialog .words");
const acceptBtn = document.querySelector(".dialog .accept-challange");
const close = document.querySelector(".dialog .close");

close.addEventListener("click", () => {
    goldenWords = [];
});

goldenBtn.addEventListener("click", () => {
    dialog.showModal();
    generateGoldenWords();
});

acceptBtn.addEventListener("click", () => {
    if (goldenWords.length === 3) {
        wordToGuess =
            goldenWords[
                Math.floor(Math.random() * goldenWords.length)
            ].toLowerCase();
        numberOfTries = 1;
        triesSpan.innerHTML = numberOfTries;
        generatInputs();
        dialog.close();
        plus.disabled = true;
        minus.disabled = true;
        goldenBtn.disabled = true;
        const currentTryDiv = document.querySelector(`.try-${currentTry}`);
        currentTryDiv.children[1].focus();
    } else {
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "please make sure you choose three words";
        dialog.appendChild(p);
    }
});

function generateGoldenWords() {
    wordsDiv.innerHTML = "";
    words.forEach((word) => {
        // create the word container
        const div = document.createElement("div");
        div.classList.add("word");
        div.textContent = word;
        div.dataset.selected = "not-selected";
        wordsDiv.appendChild(div);

        // handle choosing words
        div.addEventListener("click", function () {
            if (this.dataset.selected === "selected") {
                div.setAttribute("data-selected", "not-selected");
                this.style.background = null;
                goldenWords = goldenWords.filter(
                    (word) => word !== this.textContent
                );
                console.log(goldenWords);
            } else if (
                goldenWords.length < 3 &&
                this.dataset.selected === "not-selected"
            ) {
                goldenWords.push(this.textContent);
                this.style.background = "green";
                this.dataset.selected = "selected";
            }
        });
    });
}

window.onload = () => {
    generatInputs();
};
