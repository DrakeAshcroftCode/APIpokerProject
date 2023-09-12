const play_button = document.getElementById("play-button");
const content_div = document.getElementById("question-container");

play_button.addEventListener("click", function() {
    var currentStyle = content_div.style.display;
    content_div.style.display = "block";
    
});




const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answers');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button'); // Add this line
let currentQuestionIndex = 0;
let questions = [];
const categorySelect = document.getElementById('category-select');

async function fetchCategories() {
    try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        return data.trivia_categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}
async function getTriviaQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&category=22&type=multiple');
        const data = await response.json();
        questions = data.results;
        decodeQuestionHtmlEntities();
        showQuestion();
    } catch (error) {
        console.error('Error fetching trivia questions:', error);
    }
}

function decodeQuestionHtmlEntities() {
    for (let i = 0; i < questions.length; i++) {
        const parser = new DOMParser();
        const decodedQuestion = parser.parseFromString(questions[i].question, 'text/html').body.textContent;
        questions[i].question = decodedQuestion;
    }
}
// Function to display a question and answer choices
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    answerElement.innerHTML = '';
    const choices = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    /**filter choices html character */
    for (let i = 0; i < choices.length; i++) {
        const parser = new DOMParser();
        const decodedChoice = parser.parseFromString(choices[i].choice, 'text/html').body.textContent;
        choices[i].choice = decodedChoice;
    }
    
    shuffleArray(choices);
    choices.forEach(choice => {
        const li = document.createElement('li');
        li.innerText = choice;
        li.addEventListener('click', () => checkAnswer(choice));
        answerElement.appendChild(li);
    });
}
function checkAnswer(selectedAnswer) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
        // Handle correct answer
        alert('Correct!');
    } else {
        // Handle incorrect answer
        alert(`Incorrect! The correct answer is: ${currentQuestion.correct_answer}`);
    }
    // Move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        alert('You have completed the trivia game!');
        restartButton.style.display = 'block'; // Show the restart button
    }
}
async function populateCategoryDropdown() {
    const categories = await fetchCategories();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        alert('You have completed the trivia game!');
        restartButton.style.display = 'block'; // Show the restart button
    }
});
restartButton.addEventListener('click', () => {
    currentQuestionIndex = 0; // Reset the question index
    getTriviaQuestions(); // Start the game again
});
getTriviaQuestions();