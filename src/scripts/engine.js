const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        highScoreDisplay: document.querySelector("#high-score"), // Seleciona o elemento do high score
        startButton: document.querySelector("#startButton"),
    },
    values: {
        gameSpeed: 500,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        isGameRunning: false,
        highScore: localStorage.getItem("highScore") || 0,
    },

    actions: {
        timerId: null,
        countDownTimerId: null,
    },
};

function playSound() {
    let audio = new Audio("./src/audios/hit.m4a");
    audio.volume = 0.2
    audio.play();
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        endGame();
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (state.values.isGameRunning && square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                updateHighScore(); // Atualiza o high score ao marcar um ponto
                playSound();
            }
        });
    });
}

function updateHighScore() {
    if (state.values.result > state.values.highScore) {
        state.values.highScore = state.values.result;
        localStorage.setItem("highScore", state.values.highScore);
        state.view.highScoreDisplay.textContent = "High Score: " + state.values.highScore;
    }
}

function startGame() {
    state.values.isGameRunning = true;
    state.values.result = 0;
    state.values.currentTime = 60;
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;

    state.actions.timerId = setInterval(randomSquare, state.values.gameSpeed);
    state.actions.countDownTimerId = setInterval(countDown, 1000);

    addListenerHitBox();

    state.view.startButton.style.display = "none";
}

function endGame() {
    state.values.isGameRunning = false;
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);

    if (state.values.result > state.values.highScore) {
        state.values.highScore = state.values.result;
        localStorage.setItem("highScore", state.values.highScore);
        state.view.highScoreDisplay.textContent = "High Score: " + state.values.highScore;
        alert("Parabéns! Você alcançou um novo High Score de " + state.values.highScore + " pontos!");
    } else {
        alert("GAME OVER! A sua pontuação foi de " + state.values.result + " pontos");
    }

    state.view.startButton.style.display = "block";
}

function initialize() {
    state.view.highScoreDisplay.textContent = state.values.highScore;
    state.view.startButton.addEventListener("click", startGame);
}

initialize();
