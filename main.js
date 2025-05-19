// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const lessonBtns = document.querySelectorAll('.btn-start-lesson');
const typingModal = document.getElementById('typingModal');
const closeModal = document.querySelector('.close-modal');
const resultsModal = document.getElementById('resultsModal');
const closeResults = document.querySelector('.close-results');
const durationBtns = document.querySelectorAll('.duration-btn');
const leaderboardTabs = document.querySelectorAll('.leaderboard-tab');
const testStartBtn = document.getElementById('btnStartTest');
const testResetBtn = document.getElementById('btnResetTest');
const testTypingInput = document.getElementById('testTypingInput');
const testTextDisplay = document.getElementById('testTextDisplay');
const testWpmCounter = document.getElementById('testWpm');
const testAccuracyCounter = document.getElementById('testAccuracy');
const testTimeCounter = document.getElementById('testTime');
const testErrorsCounter = document.getElementById('testErrors');
const testResultsModal = document.getElementById('testResultsModal');
const closeTestResults = document.querySelector('.close-test-results');

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Tab functionality for lessons
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Open typing modal when lesson button is clicked
lessonBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lessonId = btn.getAttribute('data-lesson');
        // Here you would load the appropriate lesson content based on lessonId
        typingModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

// Close typing modal
closeModal.addEventListener('click', () => {
    typingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close results modal
closeResults.addEventListener('click', () => {
    resultsModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Duration buttons for speed test
durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        durationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const duration = btn.getAttribute('data-duration');
        // Update timer display
        testTimeCounter.textContent = `${duration.toString().padStart(2, '0')}:00`;
    });
});

// Leaderboard tabs
leaderboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        leaderboardTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const duration = tab.getAttribute('data-duration');
        // Here you would load the appropriate leaderboard data based on duration
    });
});

// Speed Test functionality
let testTimer;
let testStartTime;
let testDuration = 60; // Default to 1 minute
let testIsRunning = false;
let testCorrectChars = 0;
let testTotalChars = 0;
let testErrors = 0;

testStartBtn.addEventListener('click', () => {
    if (!testIsRunning) {
        startTest();
    } else {
        finishTest();
    }
});

testResetBtn.addEventListener('click', resetTest);

function startTest() {
    testIsRunning = true;
    testStartBtn.textContent = 'Finish Test';
    testStartTime = new Date().getTime();
    
    // Generate random text for the test
    const sampleText = generateSampleText();
    testTextDisplay.innerHTML = sampleText.split('').map(char => 
        `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    
    testTypingInput.value = '';
    testTypingInput.focus();
    testCorrectChars = 0;
    testTotalChars = 0;
    testErrors = 0;
    
    // Start timer
    testTimer = setInterval(updateTestTimer, 1000);
    
    // Get active duration
    const activeDurationBtn = document.querySelector('.duration-btn.active');
    testDuration = parseInt(activeDurationBtn.getAttribute('data-duration')) * 60;
    
    // Initialize time display
    const minutes = Math.floor(testDuration / 60).toString().padStart(2, '0');
    const seconds = (testDuration % 60).toString().padStart(2, '0');
    testTimeCounter.textContent = `${minutes}:${seconds}`;
}

function updateTestTimer() {
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - testStartTime) / 1000);
    const remainingSeconds = testDuration - elapsedSeconds;
    
    if (remainingSeconds <= 0) {
        finishTest();
        return;
    }
    
    const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
    testTimeCounter.textContent = `${minutes}:${seconds}`;
    
    // Calculate WPM and accuracy in real-time
    calculateTestStats();
}

function calculateTestStats() {
    const currentTime = new Date().getTime();
    const elapsedMinutes = (currentTime - testStartTime) / 60000; // Convert to minutes
    
    // Calculate WPM (5 characters = 1 word)
    const wpm = Math.round((testCorrectChars / 5) / elapsedMinutes) || 0;
    testWpmCounter.textContent = wpm;
    
    // Calculate accuracy
    const accuracy = testTotalChars > 0 ? Math.round((testCorrectChars / testTotalChars) * 100) : 100;
    testAccuracyCounter.textContent = `${accuracy}%`;
    
    // Update errors
    testErrorsCounter.textContent = testErrors;
}

testTypingInput.addEventListener('input', () => {
    if (!testIsRunning) return;
    
    const inputText = testTypingInput.value;
    const displayChars = testTextDisplay.querySelectorAll('.char');
    
    testTotalChars = inputText.length;
    testCorrectChars = 0;
    testErrors = 0;
    
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
            testCorrectChars++;
        } else {
            displayChar.classList.add('incorrect');
            displayChar.classList.remove('correct');
            testErrors++;
        }
    }
    
    calculateTestStats();
});

function finishTest() {
    testIsRunning = false;
    clearInterval(testTimer);
    testStartBtn.textContent = 'Start Test';
    
    // Calculate final stats
    const elapsedMinutes = testDuration / 60;
    const wpm = Math.round((testCorrectChars / 5) / elapsedMinutes) || 0;
    const accuracy = testTotalChars > 0 ? Math.round((testCorrectChars / testTotalChars) * 100) : 100;
    
    // Display results modal
    document.getElementById('finalTestWpm').textContent = wpm;
    document.getElementById('finalTestAccuracy').textContent = `${accuracy}%`;
    document.getElementById('finalTestErrors').textContent = testErrors;
    
    const activeDurationBtn = document.querySelector('.duration-btn.active');
    const duration = activeDurationBtn.getAttribute('data-duration');
    document.getElementById('finalTestDuration').textContent = `${duration} min`;
    document.getElementById('finalTestChars').textContent = `${testCorrectChars}/${testTotalChars}`;
    
    // Update comparison stats
    document.querySelector('.your-score').textContent = `${wpm} WPM`;
    
    // Show results modal
    testResultsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize chart
    initTestResultsChart(wpm, accuracy);
}

function resetTest() {
    clearInterval(testTimer);
    testIsRunning = false;
    testStartBtn.textContent = 'Start Test';
    testTextDisplay.innerHTML = 'Click "Start Test" to begin. The text to type will appear here.';
    testTypingInput.value = '';
    testWpmCounter.textContent = '0';
    testAccuracyCounter.textContent = '0%';
    testErrorsCounter.textContent = '0';
    
    const activeDurationBtn = document.querySelector('.duration-btn.active');
    const duration = parseInt(activeDurationBtn.getAttribute('data-duration'));
    testTimeCounter.textContent = `${duration.toString().padStart(2, '0')}:00`;
}

function generateSampleText() {
    // In a real app, you would have a more sophisticated way to generate text
    const samples = [
        "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet. " +
        "Typing is an essential skill in today's digital world. Practice makes perfect, so keep typing every day to improve your speed and accuracy.",
        
        "Programming is the process of creating a set of instructions that tell a computer how to perform a task. " +
        "JavaScript is a programming language that is one of the core technologies of the World Wide Web. " +
        "It enables interactive web pages and is an essential part of web applications.",
        
        "The best way to learn typing is to practice regularly. Start with the home row keys and gradually move to other rows. " +
        "Keep your fingers on the home row and reach for other keys without looking at the keyboard. " +
        "With consistent practice, you'll see improvement in your typing speed and accuracy."
    ];
    
    return samples[Math.floor(Math.random() * samples.length)];
}

function initTestResultsChart(wpm, accuracy) {
    const ctx = document.getElementById('testResultsChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (window.testResultsChart) {
        window.testResultsChart.destroy();
    }
    
    window.testResultsChart = new Chart(ctx, {
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
            }, {
                label: 'Average',
                data: [42, 85],
                backgroundColor: [
                    'rgba(108, 117, 125, 0.5)',
                    'rgba(108, 117, 125, 0.5)'
                ],
                borderColor: [
                    'rgba(108, 117, 125, 1)',
                    'rgba(108, 117, 125, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Close test results modal
closeTestResults.addEventListener('click', () => {
    testResultsModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Initialize keyboard visualization for speed test
function initTestKeyboard() {
    const keyboard = document.getElementById('testKeyboard');
    
    const keyboardHTML = `
        <div class="keyboard-row">
            <div class="key" data-key="`">~<br>`</div>
            <div class="key" data-key="1">!<br>1</div>
            <div class="key" data-key="2">@<br>2</div>
            <div class="key" data-key="3">#<br>3</div>
            <div class="key" data-key="4">$<br>4</div>
            <div class="key" data-key="5">%<br>5</div>
            <div class="key" data-key="6">^<br>6</div>
            <div class="key" data-key="7">&<br>7</div>
            <div class="key" data-key="8">*<br>8</div>
            <div class="key" data-key="9">(<br>9</div>
            <div class="key" data-key="0">)<br>0</div>
            <div class="key" data-key="-">_<br>-</div>
            <div class="key" data-key="=">+<br>=</div>
            <div class="key backspace">Backspace</div>
        </div>
        <div class="keyboard-row">
            <div class="key tab">Tab</div>
            <div class="key" data-key="q">Q</div>
            <div class="key" data-key="w">W</div>
            <div class="key" data-key="e">E</div>
            <div class="key" data-key="r">R</div>
            <div class="key" data-key="t">T</div>
            <div class="key" data-key="y">Y</div>
            <div class="key" data-key="u">U</div>
            <div class="key" data-key="i">I</div>
            <div class="key" data-key="o">O</div>
            <div class="key" data-key="p">P</div>
            <div class="key" data-key="[">{<br>[</div>
            <div class="key" data-key="]">}<br>]</div>
            <div class="key" data-key="\">|<br>\</div>
        </div>
        <div class="keyboard-row">
            <div class="key caps">Caps</div>
            <div class="key" data-key="a">A</div>
            <div class="key" data-key="s">S</div>
            <div class="key" data-key="d">D</div>
            <div class="key" data-key="f">F</div>
            <div class="key" data-key="g">G</div>
            <div class="key" data-key="h">H</div>
            <div class="key" data-key="j">J</div>
            <div class="key" data-key="k">K</div>
            <div class="key" data-key="l">L</div>
            <div class="key" data-key=";">:<br>;</div>
            <div class="key" data-key="'">"<br>'</div>
            <div class="key enter">Enter</div>
        </div>
        <div class="keyboard-row">
            <div class="key shift left">Shift</div>
            <div class="key" data-key="z">Z</div>
            <div class="key" data-key="x">X</div>
            <div class="key" data-key="c">C</div>
            <div class="key" data-key="v">V</div>
            <div class="key" data-key="b">B</div>
            <div class="key" data-key="n">N</div>
            <div class="key" data-key="m">M</div>
            <div class="key" data-key=","><<br>,</div>
            <div class="key" data-key=".">><br>.</div>
            <div class="key" data-key="/">?<br>/</div>
            <div class="key shift right">Shift</div>
        </div>
        <div class="keyboard-row">
            <div class="key ctrl">Ctrl</div>
            <div class="key win">Win</div>
            <div class="key alt">Alt</div>
            <div class="key space">Space</div>
            <div class="key alt">Alt</div>
            <div class="key win">Win</div>
            <div class="key menu">Menu</div>
            <div class="key ctrl">Ctrl</div>
        </div>
    `;
    
    keyboard.innerHTML = keyboardHTML;
}

// Initialize keyboard on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('testKeyboard')) {
        initTestKeyboard();
    }
});

// Handle keyboard key presses for visualization
document.addEventListener('keydown', (e) => {
    if (!testIsRunning) return;
    
    const key = e.key.toLowerCase();
    const keyboard = document.getElementById('testKeyboard');
    
    if (keyboard) {
        // Remove active class from all keys
        keyboard.querySelectorAll('.key').forEach(k => {
            k.classList.remove('active');
        });
        
        // Find the pressed key and add active class
        let keyElement;
        
        if (key === ' ') {
            keyElement = keyboard.querySelector('.space');
        } else if (key === 'enter') {
            keyElement = keyboard.querySelector('.enter');
        } else if (key === 'backspace') {
            keyElement = keyboard.querySelector('.backspace');
        } else if (key === 'tab') {
            keyElement = keyboard.querySelector('.tab');
        } else if (key === 'capslock') {
            keyElement = keyboard.querySelector('.caps');
        } else if (key === 'shift') {
            keyElement = keyboard.querySelector('.shift.left');
        } else if (key === 'control') {
            keyElement = keyboard.querySelector('.ctrl');
        } else if (key === 'alt') {
            keyElement = keyboard.querySelector('.alt');
        } else {
            keyElement = keyboard.querySelector(`[data-key="${key}"]`);
        }
        
        if (keyElement) {
            keyElement.classList.add('active');
            
            // Remove active class after a short delay
            setTimeout(() => {
                keyElement.classList.remove('active');
            }, 200);
        }
    }
});

// Handle key errors for visualization
testTypingInput.addEventListener('input', () => {
    if (!testIsRunning || !document.getElementById('highlightErrors').checked) return;
    
    const inputText = testTypingInput.value;
    const displayChars = testTextDisplay.querySelectorAll('.char');
    const keyboard = document.getElementById('testKeyboard');
    
    if (!keyboard) return;
    
    // Remove error class from all keys
    keyboard.querySelectorAll('.key').forEach(k => {
        k.classList.remove('error');
    });
    
    // Find the last character and check if it's incorrect
    const lastCharIndex = inputText.length - 1;
    
    if (lastCharIndex >= 0 && lastCharIndex < displayChars.length) {
        const inputChar = inputText[lastCharIndex];
        const displayChar = displayChars[lastCharIndex].textContent;
        
        if (inputChar !== (displayChar === '\u00A0' ? ' ' : displayChar)) {
            // Find the key element and add error class
            let keyElement = keyboard.querySelector(`[data-key="${inputChar.toLowerCase()}"]`);
            
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

// Toggle keyboard visibility
document.getElementById('showKeyboard').addEventListener('change', (e) => {
    const keyboard = document.getElementById('testKeyboard');
    if (keyboard) {
        keyboard.style.display = e.target.checked ? 'block' : 'none';
    }
});
