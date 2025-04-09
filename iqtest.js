// Placeholder Questions (Edit these later)
const questions = [];
for (let i = 1; i <= 20; i++) {
    questions.push({
        image: `questions/question${i}.png`, // Replace with actual image paths
        options: [
            `answers/ans1.png`,
            `answers/ans2.png`,
            `answers/ans3.png`,
            `answers/ans4.png`
        ],
        correct: 0 // Placeholder correct answer
    });
}

let currentIndex = 0;
let selectedAnswers = [];
let timerSeconds = 900; // 15 minutes

const questionImage = document.getElementById("question-image");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-btn");
const timerDisplay = document.getElementById("timer");

// Load Question
function loadQuestion(index) {
    const question = questions[index];
    questionImage.src = question.image;
    optionsContainer.innerHTML = "";

    question.options.forEach((option, i) => {
        const optionElement = document.createElement("img");
        optionElement.src = option;
        optionElement.classList.add("option");
        optionElement.onclick = () => selectAnswer(index, i);
        optionsContainer.appendChild(optionElement);
    });

    updateButton();
}

// Select Answer
function selectAnswer(questionIndex, answerIndex) {
    selectedAnswers[questionIndex] = answerIndex;
    document.querySelectorAll(".option").forEach((option, i) => {
        option.style.border = i === answerIndex ? "3px solid #004D40" : "2px solid #ddd";
    });
}

// Update Button
function updateButton() {
    nextButton.textContent = currentIndex === questions.length - 1 ? "Submit" : "Next ›";
}

// Change Question
function changeQuestion() {
    if (currentIndex === questions.length - 1) {
        submitTest();
        return;
    }
    currentIndex++;
    loadQuestion(currentIndex);
}

// Timer
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            submitTest();
        } else {
            timerSeconds--;
            let minutes = Math.floor(timerSeconds / 60);
            let seconds = timerSeconds % 60;
            timerDisplay.textContent = `⏳ ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }
    }, 1000);
}

// Submit Test
function submitTest() {
    alert("Test submitted! Your answers will be evaluated.");
    console.log("User Answers:", selectedAnswers); // You can replace this with API submission
}

// Button Event
nextButton.onclick = changeQuestion;

// Start Test
loadQuestion(0);
startTimer();
