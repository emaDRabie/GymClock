document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timeDisplay = document.querySelector('.time');
    const phaseLabel = document.querySelector('.phase-label');
    const startBtn = document.querySelector('.start');
    const stopBtn = document.querySelector('.stop');
    const resetBtn = document.querySelector('.reset');
    const workTimeInput = document.querySelector('.work-time');
    const restTimeInput = document.querySelector('.rest-time');
    
    // Timer variables
    let timer;
    let timeLeft;
    let isRunning = false;
    let isWorkPhase = true;
    let workTime = parseInt(workTimeInput.value);
    let restTime = parseInt(restTimeInput.value);
    
    // Initialize the timer display
    updateDisplay(workTime);
    
    // Event Listeners with touch support
    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Touch event for better mobile responsiveness
    startBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        startTimer();
    });
    
    workTimeInput.addEventListener('change', function() {
        workTime = validateTimeInput(this, 5, 300);
        if (!isRunning && isWorkPhase) {
            updateDisplay(workTime);
        }
    });
    
    restTimeInput.addEventListener('change', function() {
        restTime = validateTimeInput(this, 5, 180);
        if (!isRunning && !isWorkPhase) {
            updateDisplay(restTime);
        }
    });
    
    // Input validation function
    function validateTimeInput(input, min, max) {
        let value = parseInt(input.value);
        if (isNaN(value)) value = min;
        if (value < min) value = min;
        if (value > max) value = max;
        input.value = value;
        return value;
    }
    
    // Timer Functions
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        if (phaseLabel.textContent === 'READY') {
            phaseLabel.textContent = 'WORK';
            isWorkPhase = true;
        }
        
        const targetTime = isWorkPhase ? workTime : restTime;
        timeLeft = targetTime;
        
        timer = setInterval(function() {
            timeLeft--;
            updateDisplay(timeLeft);
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                switchPhase();
            }
        }, 1000);
    }
    
    function stopTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
    
    function resetTimer() {
        stopTimer();
        isWorkPhase = true;
        phaseLabel.textContent = 'READY';
        workTime = parseInt(workTimeInput.value);
        updateDisplay(workTime);
    }
    
    function switchPhase() {
        isWorkPhase = !isWorkPhase;
        
        if (isWorkPhase) {
            phaseLabel.textContent = 'WORK';
            timeLeft = workTime;
        } else {
            phaseLabel.textContent = 'REST';
            timeLeft = restTime;
        }
        
        updateDisplay(timeLeft);
        startTimer(); // Auto-start next phase
    }
    
    function updateDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        // Visual feedback when time is running low
        if (seconds <= 5) {
            timeDisplay.style.color = 'var(--accent-color)';
            timeDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                timeDisplay.style.transform = 'scale(1)';
            }, 500);
        } else {
            timeDisplay.style.color = 'var(--text-color)';
            timeDisplay.style.transform = 'scale(1)';
        }
    }
});