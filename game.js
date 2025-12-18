// Game State
let gameState = {
    mode: 'solo', // solo, pvp, team
    language: 'pt',
    difficulty: 'easy',
    rounds: 1,
    currentRound: 0,
    currentSquare: 0,
    score: 0,
    players: [],
    currentPlayerIndex: 0,
    highlightInterval: null,
    currentImages: [],
    correctAnswer: '',
    displayScore: true,
    manualPoints: false,
    points: {
        easy: 5,
        medium: 10,
        hard: 15
    }
};

// Configuration
const config = {
    languages: {
        pt: {
            animals: ["gato", "pato", "sapo"],
            translations: {
                gato: "Gato",
                pato: "Pato",
                sapo: "Sapo"
            }
        },
        en: {
            animals: ["gato", "pato", "sapo"],
            translations: {
                gato: "Cat",
                pato: "Duck",
                sapo: "Frog"
            }
        }
    },
    difficulty: {
        easy: { time: 800, points: 5 },
        medium: { time: 600, points: 10 },
        hard: { time: 400, points: 15 }
    },
    gridSize: 6,
    imagePath: "data"
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
});

function setupEventListeners() {
    const manualPointsToggle = document.getElementById('manualPointsToggle');
    if (manualPointsToggle) {
        manualPointsToggle.addEventListener('change', (e) => {
            document.getElementById('manualPointsSettings').style.display = 
                e.target.checked ? 'block' : 'none';
            gameState.manualPoints = e.target.checked;
            saveSettings();
        });
    }

    // Update points when changed
    ['easyPoints', 'mediumPoints', 'hardPoints'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', () => {
                const difficulty = id.replace('Points', '');
                gameState.points[difficulty] = parseInt(input.value);
                saveSettings();
            });
        }
    });

    // Display score toggle
    const displayScoreToggle = document.getElementById('displayScoreToggle');
    if (displayScoreToggle) {
        displayScoreToggle.addEventListener('change', (e) => {
            gameState.displayScore = e.target.checked;
            saveSettings();
        });
    }
}

function loadSettings() {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        gameState.language = settings.language || 'pt';
        gameState.displayScore = settings.displayScore !== undefined ? settings.displayScore : true;
        gameState.manualPoints = settings.manualPoints || false;
        gameState.points = settings.points || { easy: 5, medium: 10, hard: 15 };

        // Update UI
        document.getElementById('languageSelect').value = gameState.language;
        document.getElementById('displayScoreToggle').checked = gameState.displayScore;
        document.getElementById('manualPointsToggle').checked = gameState.manualPoints;
        document.getElementById('easyPoints').value = gameState.points.easy;
        document.getElementById('mediumPoints').value = gameState.points.medium;
        document.getElementById('hardPoints').value = gameState.points.hard;
        
        if (gameState.manualPoints) {
            document.getElementById('manualPointsSettings').style.display = 'block';
        }
    }
}

function saveSettings() {
    const settings = {
        language: gameState.language,
        displayScore: gameState.displayScore,
        manualPoints: gameState.manualPoints,
        points: gameState.points
    };
    localStorage.setItem('gameSettings', JSON.stringify(settings));
}

function changeLanguage() {
    gameState.language = document.getElementById('languageSelect').value;
    saveSettings();
}

function toggleSettings() {
    const mainMenu = document.getElementById('mainMenu');
    const settingsScreen = document.getElementById('settingsScreen');
    
    if (settingsScreen.classList.contains('active')) {
        settingsScreen.classList.remove('active');
        mainMenu.classList.add('active');
    } else {
        mainMenu.classList.remove('active');
        settingsScreen.classList.add('active');
    }
}

function selectGameMode(mode) {
    gameState.mode = mode;
    
    // Hide all setup forms
    document.getElementById('soloSetup').style.display = 'none';
    document.getElementById('pvpSetup').style.display = 'none';
    document.getElementById('teamSetup').style.display = 'none';
    
    // Show appropriate setup form
    if (mode === 'solo') {
        document.getElementById('soloSetup').style.display = 'block';
        document.getElementById('setupTitle').textContent = 'Solo Game Setup';
    } else if (mode === 'pvp') {
        document.getElementById('pvpSetup').style.display = 'block';
        document.getElementById('setupTitle').textContent = 'Player vs Player Setup';
    } else if (mode === 'team') {
        document.getElementById('teamSetup').style.display = 'block';
        document.getElementById('setupTitle').textContent = 'Team vs Team Setup';
    }
    
    // Show setup screen
    showScreen('setupScreen');
}

function startGame() {
    // Get player info based on mode
    if (gameState.mode === 'solo') {
        const name = document.getElementById('playerName').value || 'Player 1';
        gameState.difficulty = document.getElementById('difficulty').value;
        gameState.rounds = parseInt(document.getElementById('rounds').value);
        gameState.players = [{ name: name, score: 0 }];
    } else if (gameState.mode === 'pvp') {
        const p1 = document.getElementById('player1Name').value || 'Player 1';
        const p2 = document.getElementById('player2Name').value || 'Player 2';
        gameState.rounds = parseInt(document.getElementById('pvpRounds').value);
        gameState.difficulty = 'easy'; // Default for PvP
        gameState.players = [
            { name: p1, score: 0 },
            { name: p2, score: 0 }
        ];
    } else if (gameState.mode === 'team') {
        const t1 = document.getElementById('team1Name').value || 'Team 1';
        const t2 = document.getElementById('team2Name').value || 'Team 2';
        gameState.rounds = parseInt(document.getElementById('teamRounds').value);
        gameState.difficulty = 'easy'; // Default for Team
        gameState.players = [
            { name: t1, score: 0 },
            { name: t2, score: 0 }
        ];
    }
    
    gameState.currentRound = 0;
    gameState.currentPlayerIndex = 0;
    
    // Start countdown
    startCountdown();
}

function startCountdown() {
    setupGameBoard();
    showScreen('gameScreen');
    
    // Show countdown overlay
    const overlay = document.createElement('div');
    overlay.className = 'countdown-overlay';
    overlay.innerHTML = '<div class="countdown-number">3</div>';
    document.getElementById('gameScreen').appendChild(overlay);
    
    let count = 3;
    const countdownEl = overlay.querySelector('.countdown-number');
    
    const countInterval = setInterval(() => {
        countdownEl.textContent = count;
        countdownEl.style.animation = 'none';
        setTimeout(() => {
            countdownEl.style.animation = 'pulse 1s ease-in-out';
        }, 10);
        
        count--;
        
        if (count < 0) {
            clearInterval(countInterval);
            overlay.remove();
            playStartSound();
            playBackgroundMusic();
            startHighlighting();
        }
    }, 1000);
}

function startRound() {
    gameState.currentRound++;
    gameState.currentSquare = 0;
    startCountdown();
}

function setupGameBoard() {
    const grid = document.getElementById('imageGrid');
    const answerButtons = document.querySelector('.answer-buttons');
    
    // Get random animals for each square
    const animals = config.languages[gameState.language].animals;
    gameState.currentImages = [];
    for (let i = 0; i < 6; i++) {
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        gameState.currentImages.push(randomAnimal);
    }
    
    // Generate grid
    grid.innerHTML = '';
    gameState.currentImages.forEach((animal, index) => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = `${config.imagePath}/${gameState.language}/to/${animal}.jpg`;
        img.alt = animal;
        
        item.appendChild(img);
        grid.appendChild(item);
    });
    
    // Generate answer buttons (all 3 animals)
    answerButtons.innerHTML = '';
    const shuffledAnimals = [...animals].sort(() => Math.random() - 0.5);
    
    shuffledAnimals.forEach(animal => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = config.languages[gameState.language].translations[animal];
        btn.onclick = () => checkAnswer(animal);
        answerButtons.appendChild(btn);
    });
    
    // Update header
    updateGameHeader();
}

function updateGameHeader() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('currentPlayer').textContent = currentPlayer.name + ' - ';
    document.getElementById('score').textContent = currentPlayer.score;
    document.getElementById('currentRound').textContent = gameState.currentRound;
    document.getElementById('totalRounds').textContent = gameState.rounds;
}

function startHighlighting() {
    const difficultyTime = config.difficulty[gameState.difficulty].time;
    
    // Highlight first square immediately
    const items = document.querySelectorAll('.grid-item');
    items[0].classList.add('highlighted');
    gameState.correctAnswer = gameState.currentImages[0];
    gameState.currentSquare = 1;
    
    gameState.highlightInterval = setInterval(() => {
        // Remove previous highlight
        document.querySelectorAll('.grid-item').forEach(item => {
            item.classList.remove('highlighted');
        });
        
        // Add highlight to current square
        if (gameState.currentSquare < 6) {
            const items = document.querySelectorAll('.grid-item');
            items[gameState.currentSquare].classList.add('highlighted');
            gameState.correctAnswer = gameState.currentImages[gameState.currentSquare];
            gameState.currentSquare++;
        } else {
            // Reset to beginning
            gameState.currentSquare = 0;
            items[0].classList.add('highlighted');
            gameState.correctAnswer = gameState.currentImages[0];
            gameState.currentSquare = 1;
        }
    }, difficultyTime);
}

function checkAnswer(selectedAnimal) {
    // Stop highlighting temporarily
    clearInterval(gameState.highlightInterval);
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(btn => btn.disabled = true);
    
    if (selectedAnimal === gameState.correctAnswer) {
        // Correct answer
        const points = gameState.manualPoints ? 
            gameState.points[gameState.difficulty] : 
            config.difficulty[gameState.difficulty].points;
        currentPlayer.score += points;
        
        // Visual feedback
        document.querySelector('.highlighted')?.classList.add('correct');
        playCorrectSound();
        
        setTimeout(() => {
            nextTurn();
        }, 1000);
    } else {
        // Wrong answer
        document.querySelector('.highlighted')?.classList.add('wrong');
        playWrongSound();
        
        setTimeout(() => {
            nextTurn();
        }, 1000);
    }
    
    updateGameHeader();
}

function nextTurn() {
    // Remove feedback classes
    document.querySelectorAll('.grid-item').forEach(item => {
        item.classList.remove('correct', 'wrong', 'highlighted');
    });
    
    // Re-enable buttons
    document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = false);
    
    // Check if we need to switch players (for vs modes)
    if (gameState.mode === 'pvp' || gameState.mode === 'team') {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        
        // If we're back to player 1, check if round is complete
        if (gameState.currentPlayerIndex === 0) {
            if (gameState.currentRound >= gameState.rounds) {
                endGame();
                return;
            } else {
                // Start next round
                startRound();
                return;
            }
        } else {
            // Same round, different player
            setupGameBoard();
            startHighlighting();
        }
    } else {
        // Solo mode
        if (gameState.currentRound >= gameState.rounds) {
            endGame();
            return;
        } else {
            startRound();
        }
    }
}

function endGame() {
    clearInterval(gameState.highlightInterval);
    
    // Clear all highlights and feedback classes
    document.querySelectorAll('.grid-item').forEach(item => {
        item.classList.remove('highlighted', 'correct', 'wrong');
    });
    
    // Clear answer buttons
    document.querySelector('.answer-buttons').innerHTML = '';
    
    stopBackgroundMusic();
    
    showScreen('resultsScreen');
    
    const finalScores = document.getElementById('finalScores');
    
    if (gameState.displayScore) {
        if (gameState.mode === 'solo') {
            finalScores.innerHTML = `
                <h3>${gameState.players[0].name}</h3>
                <p>Final Score: ${gameState.players[0].score}</p>
            `;
        } else {
            const winner = gameState.players.reduce((a, b) => a.score > b.score ? a : b);
            const isDraw = gameState.players.every(p => p.score === winner.score);
            
            let scoresHTML = '<h3>Final Scores</h3>';
            gameState.players.forEach(player => {
                scoresHTML += `<p>${player.name}: ${player.score}</p>`;
            });
            
            if (!isDraw) {
                scoresHTML += `<p class="winner-text">🏆 ${winner.name} Wins! 🏆</p>`;
            } else {
                scoresHTML += `<p class="winner-text">🤝 It's a Draw! 🤝</p>`;
            }
            
            finalScores.innerHTML = scoresHTML;
        }
    } else {
        finalScores.innerHTML = '<h3>Game Complete!</h3><p>Scores hidden</p>';
    }
}

function retryGame() {
    // Clear game data but keep settings
    gameState.currentRound = 0;
    gameState.currentSquare = 0;
    gameState.currentPlayerIndex = 0;
    gameState.players.forEach(p => p.score = 0);
    
    startCountdown();
}

function backToMenu() {
    clearInterval(gameState.highlightInterval);
    stopBackgroundMusic();
    
    // Reset all game state
    gameState = {
        mode: 'solo',
        language: gameState.language, // Keep language
        difficulty: 'easy',
        rounds: 1,
        currentRound: 0,
        currentSquare: 0,
        score: 0,
        players: [],
        currentPlayerIndex: 0,
        highlightInterval: null,
        currentImages: [],
        correctAnswer: '',
        displayScore: gameState.displayScore, // Keep display setting
        manualPoints: gameState.manualPoints, // Keep manual points setting
        points: gameState.points // Keep points values
    };
    
    showScreen('mainMenu');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Audio Functions
function playBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.2;
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
    }
}

function stopBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
}

function playStartSound() {
    const startSound = document.getElementById('startSound');
    if (startSound) {
        startSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

function playCorrectSound() {
    const correctSound = document.getElementById('correctSound');
    if (correctSound) {
        correctSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

function playWrongSound() {
    const wrongSound = document.getElementById('wrongSound');
    if (wrongSound) {
        wrongSound.play().catch(e => console.log('Audio play failed:', e));
    }
}
