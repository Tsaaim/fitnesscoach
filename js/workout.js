const exercises = [
    { name: "Box-Squats", reps: "10–12 Wdh.", cue: "Aus den Beinen drücken, Brust aufrecht (Hebe-Muster)." },
    { name: "Erhöhte Liegestütze", reps: "8–10 Wdh.", cue: "Ganzkörperspannung (Brett), schont Schultern & LWS." },
    { name: "Glute Bridges", reps: "10–12 Wdh. (oben 2s halten)", cue: "Gesäß aktivieren, entlastet LWS komplett." },
    { name: "Bird Dog", reps: "8 Wdh. pro Seite", cue: "Fester Rumpf gegen Verdrehung (Gesangs-Atemstütze)." },
    { name: "Y-T-W Heben", reps: "Je 6 Wdh.", cue: "Schulterblätter fixieren, aufrechte Haltung." }
];

const TOTAL_ROUNDS = 3;
const REST_TIME_SECONDS = 30;

let currentRound = 1;
let currentExerciseIndex = 0;
let timerInterval = null;
let timeLeft = 0;
let audioCtx = null;

// Audio Context initialization for Beep
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeep(frequency = 800, duration = 200) {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency; // hz
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    
    // Fade out to prevent click sounds
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + (duration/1000));
    oscillator.stop(audioCtx.currentTime + (duration/1000));
}

function playEndBeep() {
    initAudio();
    // 3 short beeps
    playBeep(800, 150);
    setTimeout(() => playBeep(800, 150), 300);
    setTimeout(() => playBeep(1200, 400), 600);
}

function bindWorkoutEvents() {
    document.getElementById('btn-start-workout').addEventListener('click', startWorkout);
    document.getElementById('btn-exercise-done').addEventListener('click', nextExercise);
    document.getElementById('btn-timer-skip').addEventListener('click', skipTimer);
    document.getElementById('btn-timer-add').addEventListener('click', () => {
        timeLeft += 15;
        updateTimerDisplay();
    });
}

function startWorkout() {
    initAudio(); // Must be initialized on user gesture
    
    document.getElementById('workout-start-state').classList.add('hidden');
    document.getElementById('workout-player').classList.remove('hidden');
    
    currentRound = 1;
    currentExerciseIndex = 0;
    showExerciseView();
}

function showExerciseView() {
    document.getElementById('workout-rest-view').classList.add('hidden');
    document.getElementById('workout-exercise-view').classList.remove('hidden');
    
    document.getElementById('workout-round-text').textContent = `Runde ${currentRound} / ${TOTAL_ROUNDS}`;
    document.getElementById('workout-exercise-counter').textContent = `Übung ${currentExerciseIndex + 1} / ${exercises.length}`;
    
    const ex = exercises[currentExerciseIndex];
    document.getElementById('workout-exercise-name').textContent = ex.name;
    document.getElementById('workout-exercise-reps').textContent = ex.reps;
    document.getElementById('workout-exercise-cue').textContent = ex.cue;
}

function nextExercise() {
    // Current exercise is done
    currentExerciseIndex++;
    
    if (currentExerciseIndex >= exercises.length) {
        // Round finished
        currentExerciseIndex = 0;
        currentRound++;
        
        if (currentRound > TOTAL_ROUNDS) {
            finishWorkout();
            return;
        }
    }
    
    // Start Rest Timer
    startRestTimer();
}

function startRestTimer() {
    document.getElementById('workout-exercise-view').classList.add('hidden');
    document.getElementById('workout-rest-view').classList.remove('hidden');
    
    timeLeft = REST_TIME_SECONDS;
    updateTimerDisplay();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        // Warning beeps at 3, 2, 1
        if (timeLeft > 0 && timeLeft <= 3) {
            playBeep(600, 100);
        }
        
        if (timeLeft <= 0) {
            skipTimer();
            playEndBeep();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('workout-timer-display').textContent = timeLeft;
}

function skipTimer() {
    clearInterval(timerInterval);
    showExerciseView();
}

function finishWorkout() {
    document.getElementById('workout-player').classList.add('hidden');
    document.getElementById('workout-start-state').classList.remove('hidden');
    
    playEndBeep();
    alert("Klasse! Zirkel erfolgreich abgeschlossen. Starker Rücken für heute gesichert! 🔥");
    
    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
