const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const potion = document.getElementById('potion');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');

let playerPosition = 275;
const playerSpeed = 20;
let score = 0;
let potionSpeed = 2;
let potionPosition = { x: 0, y: 10 };
let gameOver = false;
let potionAnimationFrame;  // Variable para almacenar la referencia a la animación

// Mueve a Akko con las teclas de flecha izquierda y derecha
function movePlayer(event) {
    if (event.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= playerSpeed;
    } else if (event.key === 'ArrowRight' && playerPosition < gameContainer.clientWidth - player.clientWidth) {
        playerPosition += playerSpeed;
    }
    player.style.left = `${playerPosition}px`;
}

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
    if (gameOver) return; // Si el juego terminó, detiene la animación

    potionPosition.y += potionSpeed;
    potion.style.top = `${potionPosition.y}px`; // Actualiza la posición de la poción

    if (checkCollision()) {
        score++;
        scoreDisplay.textContent = `Puntos: ${score}`;
        potionSpeed += 0.5; // Aumenta la velocidad de la poción progresivamente
        resetPotion();
    } else if (potionPosition.y > gameContainer.clientHeight) {
        endGame();
    }

    potionAnimationFrame = requestAnimationFrame(dropPotion); // Vuelve a llamar a esta función
}

// Resetea la posición de la poción tras atraparla
function resetPotion() {
    potionPosition.y = 10;
    potionPosition.x = Math.random() * (gameContainer.clientWidth - potion.clientWidth);
    potion.style.top = `${potionPosition.y}px`;
    potion.style.left = `${potionPosition.x}px`; // Posición aleatoria horizontal
}

// Termina el juego y muestra una alerta
function endGame() {
    gameOver = true;
    cancelAnimationFrame(potionAnimationFrame);  // Detiene la animación
    alert(`Juego terminado. Puntos finales: ${score}`);
}

// Reinicia todo el juego
function resetGame() {
    score = 0;
    potionSpeed = 2;
    gameOver = false;
    scoreDisplay.textContent = `Puntos: ${score}`;
    resetPotion();
    startPotionFall(); // Reinicia la caída de la poción
}

// Inicia la caída de la poción
function startPotionFall() {
    if (!gameOver) {
        dropPotion(); // Solo empieza a caer si el juego no ha terminado
    }
}

document.addEventListener('keydown', movePlayer);
restartButton.addEventListener('click', resetGame);

