const timeDisplay = document.getElementById('time-text');

const toggleBtn = document.getElementById('toggle-btn');
const resetBtn = document.getElementById('reset-btn');

const TOTAL_TIME = 3 * 60; // 8 minutes in seconds
const QNA_TIME = 1 * 60;   // last 2 minutes

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
        document.body.classList.add('state-danger');
    } else if (timeRemaining <= QNA_TIME) {
        document.body.classList.add('state-qna');
    } else {
        if (timerInterval) {
            document.body.classList.add('state-running');
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
        toggleBtn.disabled = true;
        toggleBtn.textContent = 'START TIMER';
        toggleBtn.className = 'btn btn-pink';
        updateDisplay();
    }
}

function handleToggleTimer() {
    if (isFinshed) return;
    
    if (timerInterval) {
        // Pause logic
        clearInterval(timerInterval);
        timerInterval = null;
        toggleBtn.textContent = 'RESUME';
        toggleBtn.className = 'btn btn-yellow';
        document.body.classList.remove('state-running');
    } else {
        // Start/resume logic
        timerInterval = setInterval(tick, 1000);
        toggleBtn.textContent = 'PAUSE';
        toggleBtn.className = 'btn btn-pink';
        updateDisplay();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeRemaining = TOTAL_TIME;
    isFinshed = false;
    toggleBtn.disabled = false;
    toggleBtn.textContent = 'START TIMER';
    toggleBtn.className = 'btn btn-pink';
    document.body.classList.remove('state-running', 'state-qna', 'state-danger');
    updateDisplay();
}

toggleBtn.addEventListener('click', handleToggleTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
