const timeDisplay = document.getElementById('time-text');
const statusMessage = document.getElementById('status-message');

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

const TOTAL_TIME = 8 * 60; // 8 minutes in seconds
const QNA_TIME = 2 * 60;   // last 2 minutes

let timeRemaining = TOTAL_TIME;
let timerInterval = null;
let isFinshed = false;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateDisplay() {
    timeDisplay.textContent = formatTime(timeRemaining);
    
    // Clear all state classes
    document.body.classList.remove('state-qna', 'state-danger', 'state-running');

    if (timeRemaining === 0) {
        statusMessage.textContent = "TIME'S UP!";
        document.body.classList.add('state-danger');
    } else if (timeRemaining <= QNA_TIME) {
        statusMessage.textContent = "Q&A TIME!";
        document.body.classList.add('state-qna');
    } else {
        if (timerInterval) {
            statusMessage.textContent = "RUNNING";
            document.body.classList.add('state-running');
        } else {
            statusMessage.textContent = "READY";
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
        startBtn.textContent = 'START TIMER';
        updateDisplay();
    }
}

function startTimer() {
    if (timerInterval) return; // already running
    if (isFinshed) return;
    
    timerInterval = setInterval(tick, 1000);
    startBtn.textContent = 'RUNNING...';
    pauseBtn.disabled = false;
    updateDisplay();
}

function pauseTimer() {
    if (!timerInterval) return; // not running
    
    clearInterval(timerInterval);
    timerInterval = null;
    startBtn.textContent = 'RESUME';
    statusMessage.textContent = "PAUSED";
    document.body.classList.remove('state-running');
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeRemaining = TOTAL_TIME;
    isFinshed = false;
    startBtn.disabled = false;
    startBtn.textContent = 'START TIMER';
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
