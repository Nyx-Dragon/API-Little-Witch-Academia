document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".character-container");

    // Delegación de eventos para los botones de edición y eliminación
    container.addEventListener("click", function (event) {
        const card = event.target.closest(".character-card");
        if (!card) return;

        if (event.target.classList.contains("edit-btn")) {
            handleEditButtonClick(card);
        } else if (event.target.classList.contains("delete-btn")) {
            handleDeleteButtonClick(card);
        }
    });

    // Inicializa los controles de música
    initMusicControls();
});

// Función para inicializar los controles de música
function initMusicControls() {
    const playButton = document.getElementById("play-music");
    const volumeControl = document.getElementById("volume-control");
    const audio = document.getElementById("background-music");

    // Reproducir música al hacer clic en el botón
    playButton.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
            playButton.textContent = "Pausar";
        } else {
            audio.pause();
            playButton.textContent = "Reproducir";
        }
    });

    // Controlar el volumen
    volumeControl.addEventListener("input", function () {
        audio.volume = volumeControl.value;
    });
}

function renderFeaturedCharacters(characters) {
    const container = document.getElementById("characters-container");
    if (!container) return;

    container.innerHTML = characters
        .map(
            (char) => `
      <div class="character-card">
        <img src="${char.image}" alt="${char.name}">
        <h3>${char.name}</h3>
        <p>${char.description}</p>
        <div class="buttons">
          <button class="edit-btn">
            <i class="fa fa-pencil"></i> Editar
          </button>
          <button class="delete-btn">
            <i class="fa fa-trash"></i> Borrar
          </button>
        </div>
      </div>
    `
        )
        .join("");
}

function showErrorToUser(message) {
    const errorContainer =
        document.getElementById("error-container") || document.body;
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

// Función para manejar el clic en el botón de editar
function handleEditButtonClick(card) {
    const characterName = card.querySelector(".character-name").textContent;
    const characterRole = card.querySelector(
        ".character-description"
    ).textContent;

    const newName = prompt("Editar nombre del personaje", characterName);
    if (newName) {
        card.querySelector(".character-name").textContent = newName;
    }

    const newRole = prompt("Editar rol del personaje", characterRole);
    if (newRole) {
        card.querySelector(".character-description").textContent = newRole;
    }
}

// Función para manejar el clic en el botón de eliminar
function handleDeleteButtonClick(card) {
    if (confirm("¿Estás seguro de que quieres eliminar este personaje?")) {
        card.remove();
    }
}

// Función para obtener los personajes desde la API
/* async function fetchCharacters() {
    const response = await fetch("https://api.example.com/characters");
    if (!response.ok) {
        throw new Error("Error al cargar los personajes");
    }
    return await response.json();
} */
