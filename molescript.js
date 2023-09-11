const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('#score');
let lastHole;
let timeUp = false;
let score = 0;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function showMole() {
    const time = randomTime(200, 1000); // Duration for the mole to show
    const hole = randomHole(holes);
    hole.classList.add('up'); // Make mole visible
    setTimeout(() => {
        hole.classList.remove('up'); // Hide mole
        if (!timeUp) showMole();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    showMole();
    setTimeout(() => timeUp = true, 10000) // 10 seconds game time
}

function whack(e) {
    if(!e.isTrusted) return; // Cheater detection
    if(e.target !== this.querySelector('.mole')) return; // Make sure mole was clicked
    score++;
    this.classList.remove('up'); // Hide the mole immediately
    scoreBoard.textContent = score;
}

holes.forEach(hole => hole.addEventListener('click', whack));
