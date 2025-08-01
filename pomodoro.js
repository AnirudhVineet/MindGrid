// Default durations in seconds
const MODES = {
  pomodoro: { duration: 25 * 60, color: '#ff6b6b', label: 'Pomodoro' },
  shortBreak: { duration: 5 * 60, color: '#4ecdc4', label: 'Short Break' },
  longBreak: { duration: 15 * 60, color: '#1a535c', label: 'Long Break' },
};

let currentMode = 'pomodoro';
let timeLeft = MODES[currentMode].duration;
let timerInterval = null;
let isRunning = false;

// DOM Elements
const timeDisplay = document.getElementById('time');
const toggleBtn = document.getElementById('toggle-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = {
  pomodoro: document.getElementById('pomodoro-btn'),
  shortBreak: document.getElementById('short-break-btn'),
  longBreak: document.getElementById('long-break-btn')
};
const body = document.body;

// Format seconds as mm:ss
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Update UI time
function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
}

// Visual + audio indication on end
function onTimerEnd() {
  const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

  // Play 3 beeps with 400ms gap between each
  audio.play();
  setTimeout(() => new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(), 200);
  setTimeout(() => new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(), 400);
  setTimeout(() => new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(), 600);
  setTimeout(() => new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(), 1000);
  setTimeout(() => new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(), 1200);
  setTimeout(() => new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(), 1400);
  setTimeout(() => new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(), 1600);

  // Visual flash
  document.body.classList.add('flash-bg');
  setTimeout(() => {
    document.body.classList.remove('flash-bg');
  }, 2000);
}


// Mode switch logic
function setMode(mode) {
  clearInterval(timerInterval);
  isRunning = false;
  toggleBtn.textContent = 'Start';

  currentMode = mode;
  timeLeft = MODES[mode].duration;
  updateDisplay();

  // Background color transition
  body.style.transition = 'background-color 0.5s ease';
  body.style.backgroundColor = MODES[mode].color;

  // Update active mode button styles
  for (let m in modeButtons) {
    modeButtons[m].classList.remove('active');
  }
  modeButtons[mode].classList.add('active');

  setTimeout(updateProgressRing, 50); // ✅ Give DOM time to settle
}



// Start countdown
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  toggleBtn.textContent = 'Pause';

  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      toggleBtn.textContent = 'Start';
      onTimerEnd(); // 🔔 Play sound + flash
    } else {
        timeLeft--;
        updateDisplay();
        updateProgressRing();

    }
  }, 1000);
}

// Pause countdown
function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  toggleBtn.textContent = 'Start';
}

// Event listeners
toggleBtn.addEventListener('click', () => {
  if (timeLeft === 0) {
    timeLeft = MODES[currentMode].duration;
    updateDisplay();
    updateProgressRing();
  }

  isRunning ? pauseTimer() : startTimer();
});


resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = MODES[currentMode].duration;
  updateDisplay();
  setTimeout(updateProgressRing, 50); // ✅ Small delay for smoother reset
  toggleBtn.textContent = 'Start';
});



modeButtons.pomodoro.addEventListener('click', () => setMode('pomodoro'));
modeButtons.shortBreak.addEventListener('click', () => setMode('shortBreak'));
modeButtons.longBreak.addEventListener('click', () => setMode('longBreak'));

// Init
setMode('pomodoro');
updateDisplay();

const ring = document.querySelector('.progress-ring-circle');
const RADIUS = 110; // MATCH your SVG circle's radius
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

ring.style.strokeDasharray = `${CIRCUMFERENCE}`;
ring.style.strokeDashoffset = `${CIRCUMFERENCE}`;

function updateProgressRing() {
  const total = MODES[currentMode].duration;
  const progress = total === 0 ? 0 : (total - timeLeft) / total;
  const offset = CIRCUMFERENCE - progress * CIRCUMFERENCE;
  ring.style.strokeDashoffset = offset;
}

