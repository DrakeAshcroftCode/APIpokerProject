// Achievements definition

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
        description: "10 incorrect answers. Maybe you're just too modern for Y2K?",
        condition: (stats) => stats.incorrectAnswers >= 10
    }
];

// Load achievements from localStorage
function loadAchievements() {
    const storedAchievements = localStorage.getItem('achievements');
    if (storedAchievements) {
        return JSON.parse(storedAchievements);
    }
    return [];
}

// Save achievements to localStorage
function saveAchievements(achievements) {
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

// Check and update achievements based on player stats
function clearAchievements() {
    localStorage.setItem('achievements', JSON.stringify([]));
}
function updateAchievements(stats) {
    let achievementsUnlocked = loadAchievements();
    let newAchievements = false;

    for (const achievement of ACHIEVEMENTS) {
        if (achievementsUnlocked.includes(achievement.id)) {
            continue; // Skip already unlocked achievements
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

export { updateAchievements, ACHIEVEMENTS, loadAchievements };
