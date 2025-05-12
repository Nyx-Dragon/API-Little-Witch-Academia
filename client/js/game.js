const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const potion = document.getElementById("potion");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");
const leftButton = document.createElement("button");
const rightButton = document.createElement("button");

leftButton.textContent = "◀";
rightButton.textContent = "▶";
leftButton.classList.add("control-button");
rightButton.classList.add("control-button");
document.body.appendChild(leftButton);
document.body.appendChild(rightButton);

let playerPosition = 275;
const playerSpeed = 20;
let score = 0;
let potionSpeed = 2;
let potionPosition = { x: 0, y: 10 };
let gameOver = false;
let potionAnimationFrame;
let timer = 60;
let level = 1;
let timerInterval;
const catchSound = new Audio("../audio/catch.mp3");
const gameOverSound = new Audio("../audio/gameover.wav");

// Mueve al personaje con las teclas
function movePlayer(event) {
    if (event.key === "ArrowLeft" && playerPosition > 0) {
        playerPosition -= playerSpeed;
    } else if (
        event.key === "ArrowRight" &&
        playerPosition < gameContainer.clientWidth - player.clientWidth
    ) {
        playerPosition += playerSpeed;
    }
    player.style.left = `${playerPosition}px`;
}

// Movimiento táctil con botones
leftButton.addEventListener("click", () => {
    if (playerPosition > 0) {
        playerPosition -= playerSpeed;
        player.style.left = `${playerPosition}px`;
    }
});

rightButton.addEventListener("click", () => {
    if (playerPosition < gameContainer.clientWidth - player.clientWidth) {
        playerPosition += playerSpeed;
        player.style.left = `${playerPosition}px`;
    }
});

// Comprobación de colisión precisa
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const potionRect = potion.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    return (
        potionRect.bottom >= playerRect.top &&
        potionRect.top <= playerRect.bottom &&
        potionRect.left < playerRect.right &&
        potionRect.right > playerRect.left &&
        potionRect.bottom <= containerRect.bottom
    );
}

// Mueve la poción hacia abajo
function dropPotion() {
    if (gameOver) return;

    potionPosition.y += potionSpeed;
    potion.style.top = `${potionPosition.y}px`;

    if (checkCollision()) {
        score++;
        scoreDisplay.textContent = `Puntos: ${score}`;
        catchSound.play();
        potionSpeed += 0.5;
        resetPotion();
    } else if (potionPosition.y > gameContainer.clientHeight) {
        endGame();
    }

    potionAnimationFrame = requestAnimationFrame(dropPotion);
}

// Resetea la poción
function resetPotion() {
    potionPosition.y = 10;
    potionPosition.x =
        Math.random() * (gameContainer.clientWidth - potion.clientWidth);
    potion.style.top = `${potionPosition.y}px`;
    potion.style.left = `${potionPosition.x}px`;
}

// Termina el juego
function endGame() {
    gameOver = true;
    cancelAnimationFrame(potionAnimationFrame);
    clearInterval(timerInterval);
    gameOverSound.play();
    alert(`Juego terminado. Puntos finales: ${score}`);
}

// Reinicia el juego
function resetGame() {
    score = 0;
    potionSpeed = 2;
    timer = 60;
    level = 1;
    gameOver = false;
    scoreDisplay.textContent = `Puntos: ${score}`;
    resetPotion();
    startPotionFall();
}

// Inicia la caída de la poción
function startPotionFall() {
    dropPotion();
}

document.addEventListener("keydown", movePlayer);
restartButton.addEventListener("click", resetGame);

// Inicializa el juego al cargar
resetGame();

// Estilos para los botones de control
document.head.insertAdjacentHTML(
    "beforeend",
    `
    <style>
        .control-button {
            position: fixed;
            bottom: 20px;
            width: 50px;
            height: 50px;
            font-size: 24px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .control-button:active {
            background-color: #555;
        }
        .control-button:first-of-type {
            left: 20px;
        }
        .control-button:last-of-type {
            right: 20px;
        }
    </style>
`
);
