// Typing Lesson Functionality
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('typingModal')) return;
    
    // DOM Elements
    const typingInput = document.getElementById('typingInput');
    const textDisplay = document.getElementById('textDisplay');
    const wpmCounter = document.getElementById('wpmCounter');
    const accuracyCounter = document.getElementById('accuracyCounter');
    const timeCounter = document.getElementById('timeCounter');
    const btnStart = document.getElementById('btnStart');
    const btnRestart = document.getElementById('btnRestart');
    const btnNext = document.getElementById('btnNext');
    const keys = document.querySelectorAll('.keyboard-visual .key');
    
    // Lesson variables
    let lessonText = "This is a sample typing lesson. The quick brown fox jumps over the lazy dog. Practice typing this text to improve your speed and accuracy.";
    let startTime;
    let timerInterval;
    let correctChars = 0;
    let totalChars = 0;
    let errors = 0;
    let isRunning = false;
    let currentLesson = 1;
    
    // Initialize lesson
    function initLesson() {
        // In a real app, you would load lesson text based on the current lesson
        textDisplay.innerHTML = lessonText.split('').map(char => 
            `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        
        typingInput.value = '';
        wpmCounter.textContent = '0';
        accuracyCounter.textContent = '100%';
        timeCounter.textContent = '00:00';
        correctChars = 0;
        totalChars = 0;
        errors = 0;
        isRunning = false;
        btnStart.textContent = 'Start';
        clearInterval(timerInterval);
    }
    
    // Start lesson
    btnStart.addEventListener('click', () => {
        if (!isRunning) {
            startLesson();
        } else {
            finishLesson();
        }
    });
    
    function startLesson() {
        isRunning = true;
        btnStart.textContent = 'Finish';
        startTime = new Date().getTime();
        timerInterval = setInterval(updateTimer, 1000);
        typingInput.focus();
    }
    
    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
        const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
        timeCounter.textContent = `${minutes}:${seconds}`;
        
        // Calculate WPM and accuracy in real-time
        calculateStats();
    }
    
    function calculateStats() {
        const currentTime = new Date().getTime();
        const elapsedMinutes = (currentTime - startTime) / 60000; // Convert to minutes
        
        // Calculate WPM (5 characters = 1 word)
        const wpm = Math.round((correctChars / 5) / elapsedMinutes) || 0;
        wpmCounter.textContent = wpm;
        
        // Calculate accuracy
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
        accuracyCounter.textContent = `${accuracy}%`;
    }
    
    // Handle typing input
    typingInput.addEventListener('input', () => {
        if (!isRunning) return;
        
        const inputText = typingInput.value;
        const displayChars = textDisplay.querySelectorAll('.char');
        
        totalChars = inputText.length;
        correctChars = 0;
        errors = 0;
        
        for (let i = 0; i < displayChars.length; i++) {
            const displayChar = displayChars[i];
            const inputChar = inputText[i];
            
            if (i >= inputText.length) {
                displayChar.classList.remove('correct', 'incorrect');
                continue;
            }
            
            if (displayChar.textContent === (inputChar === ' ' ? '\u00A0' : inputChar)) {
                displayChar.classList.add('correct');
                displayChar.classList.remove('incorrect');
                correctChars++;
            } else {
                displayChar.classList.add('incorrect');
                displayChar.classList.remove('correct');
                errors++;
            }
        }
        
        calculateStats();
        
        // If all characters are typed correctly, finish the lesson
        if (inputText.length === lessonText.length && errors === 0) {
            finishLesson();
        }
    });
    
    // Finish lesson
    function finishLesson() {
        isRunning = false;
        clearInterval(timerInterval);
        btnStart.textContent = 'Start';
        
        // Calculate final stats
        const currentTime = new Date().getTime();
        const elapsedMinutes = (currentTime - startTime) / 60000;
        const wpm = Math.round((correctChars / 5) / elapsedMinutes) || 0;
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
        const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
        
        // Display results modal
        document.getElementById('finalWpm').textContent = wpm;
        document.getElementById('finalAccuracy').textContent = `${accuracy}%`;
        document.getElementById('finalTime').textContent = `${minutes}:${seconds}`;
        document.getElementById('finalErrors').textContent = errors;
        
        // Show results modal
        resultsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Initialize chart
        initResultsChart(wpm, accuracy);
    }
    
    // Restart lesson
    btnRestart.addEventListener('click', initLesson);
    
    // Next lesson
    btnNext.addEventListener('click', () => {
        // In a real app, you would load the next lesson
        currentLesson++;
        lessonText = `This is lesson ${currentLesson}. Practice makes perfect. The more you type, the better you'll get. Keep your fingers on the home row and try not to look at the keyboard.`;
        initLesson();
        resultsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Initialize results chart
    function initResultsChart(wpm, accuracy) {
        const ctx = document.getElementById('resultsChart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (window.resultsChart) {
            window.resultsChart.destroy();
        }
        
        window.resultsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['WPM', 'Accuracy'],
                datasets: [{
                    label: 'Your Results',
                    data: [wpm, accuracy],
                    backgroundColor: [
                        'rgba(67, 97, 238, 0.7)',
                        'rgba(76, 201, 240, 0.7)'
                    ],
                    borderColor: [
                        'rgba(67, 97, 238, 1)',
                        'rgba(76, 201, 240, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Handle keyboard key presses for visualization
    document.addEventListener('keydown', (e) => {
        if (!isRunning) return;
        
        const key = e.key.toLowerCase();
        
        // Remove active class from all keys
        keys.forEach(k => {
            k.classList.remove('active');
        });
        
        // Find the pressed key and add active class
        let keyElement;
        
        if (key === ' ') {
            keyElement = document.querySelector('.space');
        } else if (key === 'enter') {
            keyElement = document.querySelector('.enter');
        } else if (key === 'backspace') {
            keyElement = document.querySelector('.backspace');
        } else if (key === 'tab') {
            keyElement = document.querySelector('.tab');
        } else if (key === 'capslock') {
            keyElement = document.querySelector('.caps');
        } else if (key === 'shift') {
            keyElement = document.querySelector('.shift.left');
        } else if (key === 'control') {
            keyElement = document.querySelector('.ctrl');
        } else if (key === 'alt') {
            keyElement = document.querySelector('.alt');
        } else {
            keyElement = document.querySelector(`[data-key="${key}"]`);
        }
        
        if (keyElement) {
            keyElement.classList.add('active');
            
            // Remove active class after a short delay
            setTimeout(() => {
                keyElement.classList.remove('active');
            }, 200);
        }
    });
    
    // Handle key errors for visualization
    typingInput.addEventListener('input', () => {
        if (!isRunning) return;
        
        const inputText = typingInput.value;
        const displayChars = textDisplay.querySelectorAll('.char');
        
        // Remove error class from all keys
        keys.forEach(k => {
            k.classList.remove('error');
        });
        
        // Find the last character and check if it's incorrect
        const lastCharIndex = inputText.length - 1;
        
        if (lastCharIndex >= 0 && lastCharIndex < displayChars.length) {
            const inputChar = inputText[lastCharIndex];
            const displayChar = displayChars[lastCharIndex].textContent;
            
            if (inputChar !== (displayChar === '\u00A0' ? ' ' : displayChar)) {
                // Find the key element and add error class
                let keyElement = document.querySelector(`[data-key="${inputChar.toLowerCase()}"]`);
                
                if (keyElement) {
                    keyElement.classList.add('error');
                    
                    // Remove error class after a short delay
                    setTimeout(() => {
                        keyElement.classList.remove('error');
                    }, 1000);
                }
            }
        }
    });
    
    // Initialize the lesson
    initLesson();
});
