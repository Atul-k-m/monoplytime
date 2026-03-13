const timeDisplay = document.getElementById('time-text');
const statusMessage = document.getElementById('status-message');
const circleProgress = document.querySelector('.circle-progress .progress');
const container = document.querySelector('.timer-container');

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

const TOTAL_TIME = 8 * 60; // 8 minutes in seconds
const QNA_TIME = 2 * 60;   // last 2 minutes

let timeRemaining = TOTAL_TIME;
let timerInterval = null;
let isFinshed = false;

// 2 * PI * R (90)
const circumference = 2 * Math.PI * 90;
circleProgress.style.strokeDasharray = `${circumference}`;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateDisplay() {
    timeDisplay.textContent = formatTime(timeRemaining);
    
    // Calculate progress offset
    const progressOffset = circumference - (timeRemaining / TOTAL_TIME) * circumference;
    circleProgress.style.strokeDashoffset = progressOffset;

    container.classList.remove('state-qna', 'state-danger');

    // Update messages and themes based on remaining time
    if (timeRemaining === 0) {
        statusMessage.textContent = "Time's up!";
        container.classList.add('state-danger');
    } else if (timeRemaining <= QNA_TIME) {
        statusMessage.textContent = "QnA time!";
        container.classList.add('state-qna');
    } else {
        if (timerInterval) {
            statusMessage.textContent = "Timer running...";
        } else {
            statusMessage.textContent = "Ready";
        }
    }
}

function tick() {
    if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
    }
    
    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        isFinshed = true;
        startBtn.disabled = true;
        startBtn.textContent = 'Start';
        updateDisplay();
    }
}

function startTimer() {
    if (timerInterval) return; // already running
    if (isFinshed) return;
    
    timerInterval = setInterval(tick, 1000);
    startBtn.textContent = 'Running';
    pauseBtn.disabled = false;
    updateDisplay();
}

function pauseTimer() {
    if (!timerInterval) return; // not running
    
    clearInterval(timerInterval);
    timerInterval = null;
    startBtn.textContent = 'Resume';
    statusMessage.textContent = "Paused";
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeRemaining = TOTAL_TIME;
    isFinshed = false;
    startBtn.disabled = false;
    startBtn.textContent = 'Start';
    statusMessage.textContent = "Ready";
    container.classList.remove('state-qna', 'state-danger');
    // Important: remove CSS transition briefly so it snaps back, or let it animate smoothly back to 0
    circleProgress.style.transition = 'none';
    updateDisplay();
    setTimeout(() => {
        circleProgress.style.transition = 'stroke-dashoffset 1s linear, stroke 0.5s ease';
    }, 50);
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
