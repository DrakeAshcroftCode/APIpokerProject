
const backpackLink = document.getElementById('backpackLink');
const achievementsMenu = document.getElementById('achievementsMenu');
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timerInterval;
let alltimeScore = 0;
const ACHIEVEMENTS = [
    {
        id: 1,
        name: "Baby Steps",
        description: "Got your first correct answer. Welcome to the Y2K trivia!",
        condition: (stats) => stats.correctAnswers >= 1
    },
    {
        id: 2,
        name: "Lucky Guess",
        description: "Achieved 5 correct answers. Maybe it's all just luck?",
        condition: (stats) => stats.correctAnswers >= 5
    },
    {
        id: 3,
        name: "Smarty Pants",
        description: "Nailed 10 correct answers. The 2000s are strong with this one!",
        condition: (stats) => stats.correctAnswers >= 10
    },
    {
        id: 4,
        name: "Oopsie Daisy",
        description: "Got your first incorrect answer. It's okay, we all make mistakes!",
        condition: (stats) => stats.incorrectAnswers >= 1
    },
    {
        id: 5,
        name: "Guess Master",
        description: "10 incorrect answers. Maybe you're just too smart for this dumb game?",
        condition: (stats) => stats.incorrectAnswers >= 10
    },
    {
        id: 6,
        name: "It's okay to fail",
        description: "Got your fifth incorrect answer. At least you're trying!",
        condition: (stats) => stats.incorrectAnswers >= 5
    },
    {
        id: 7,
        name: "Talented at Trivia",
        description: "10 Correct answers. Very good!",
        condition: (stats) => stats.correcttAnswers >= 15
    },
];

function loadAchievements() {
    const storedAchievements = localStorage.getItem('achievements');
    if (storedAchievements) {
        return JSON.parse(storedAchievements);
    }
    return [];
}

function saveAchievements(achievements) {
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

function updateAchievements(stats) {
    let achievementsUnlocked = loadAchievements();
    let newAchievements = false;

    for (const achievement of ACHIEVEMENTS) {
        if (achievementsUnlocked.includes(achievement.id)) {
            continue; 
        }

        if (achievement.condition(stats)) {
            achievementsUnlocked.push(achievement.id);
            alert(`Achievement Unlocked: ${achievement.name} - ${achievement.description}`);
            newAchievements = true;
        }
    }

    if (newAchievements) {
        saveAchievements(achievementsUnlocked);
    }
}
async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10');
    const data = await response.json();
    questions = data.results;
    decodeQuestionHtmlEntities(); 
    displayQuestion();
}
function decodeQuestionHtmlEntities() {
    for (let i = 0; i < questions.length; i++) {
        const parser = new DOMParser();
        const decodedQuestion = parser.parseFromString(questions[i].question, 'text/html').body.textContent;
        questions[i].question = decodedQuestion;
    }
}
function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById('question').textContent = question.question;

        const answers = [...question.incorrect_answers, question.correct_answer];
        
        answers.sort(() => Math.random() - 0.5);

        let answersHtml = '';
        for (let answer of answers) {
            answersHtml += `<button onclick="checkAnswer('${answer}')">${answer}</button>`;
        }
        document.getElementById('answers').innerHTML = answersHtml;

        startTimer();
    } else {
        alert('Quiz finished! Your score is: ' + score);
    }
}
let correctAnswers = 0;
let allTimeScore= 0;
let incorrectAnswers = 0;

function updateLocalStorage() {
    localStorage.setItem('correctAnswers', correctAnswers);
    localStorage.setItem('incorrectAnswers', incorrectAnswers);
}


function checkAnswer(answer) {
    clearInterval(timerInterval);
    if (answer === questions[currentQuestionIndex].correct_answer) {
        score++;
        alltimeScore++;
        correctAnswers++;
        document.getElementById('score').textContent = score;
    } else {
        incorrectAnswers++;
    }
    updateLocalStorage();
    
    const stats = {
        correctAnswers: correctAnswers,
        incorrectAnswers: incorrectAnswers
    };
    
    updateAchievements(stats);  
    currentQuestionIndex++;
    loadStats();

    displayQuestion();
}


function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    document.getElementById('timer').textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time out!');
            currentQuestionIndex++;
            displayQuestion();
        }
    }, 1000);
}

document.getElementById('nextQuestion').addEventListener('click', () => {
    clearInterval(timerInterval);
    currentQuestionIndex++;
    displayQuestion();
    displayAchievements()
    loadStats();


});
document.getElementById('resetStats').addEventListener('click', () => {
    correctAnswers = 0;
    incorrectAnswers = 0;
    updateLocalStorage();
    clearAchievements();  
    displayAchievements()

    loadStats(); 
});

function loadStats() {
    correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
    incorrectAnswers = parseInt(localStorage.getItem('incorrectAnswers')) || 0;

    document.getElementById('correctAnswers').textContent = correctAnswers;
    document.getElementById('incorrectAnswers').textContent = incorrectAnswers;
}
document.getElementById('startTrivia').addEventListener('click', () => {

    fetchQuestions();
    displayAchievements()

    loadStats();

    document.getElementById('startTrivia').style.display = 'none';
});
document.getElementById('backpackLink').addEventListener('click', function(event) {
    event.preventDefault();
    displayAchievements();
    const menu = document.getElementById('achievementsMenu');
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
    } else {
        menu.classList.add('open');
    }
});
function clearAchievements() {
    localStorage.setItem('achievements', JSON.stringify([]));
    displayAchievements()
    loadStats();

}
function displayAchievements() {
    const unlockedIds = loadAchievements();
    const unlockedAchievements = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));

    const list = document.getElementById('achievementsList');
    list.innerHTML = '';  // Clear the list

    for (const achievement of unlockedAchievements) {
        const listItem = document.createElement('li');
        listItem.textContent = `${achievement.name}: ${achievement.description}`;
        list.appendChild(listItem);
    }
}

displayAchievements()
loadStats();


