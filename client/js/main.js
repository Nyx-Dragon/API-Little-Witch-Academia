document.addEventListener("DOMContentLoaded", () => {
    const warningAccepted = localStorage.getItem("epilepsyWarningAccepted");
    const warningModal = document.getElementById("epilepsy-warning");
    const acceptButton = document.getElementById("accept-warning");

    if (!warningAccepted) {
        // Mostrar advertencia
        warningModal.style.visibility = "visible";
        warningModal.style.opacity = "1";

        // Detener scroll mientras aparece
        document.body.style.overflow = "hidden";

        acceptButton.addEventListener("click", () => {
            // Ocultar advertencia
            warningModal.style.opacity = "0";
            setTimeout(() => {
                warningModal.style.visibility = "hidden";
                document.body.style.overflow = ""; // Restaurar scroll
            }, 300);

            // Guardar aceptación en localStorage
            localStorage.setItem("epilepsyWarningAccepted", "true");
        });
    }
});

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

const baseLocal = "/api";
const baseRemote = "https://api-little-witch-academia.onrender.com/api";

// Prueba primero el servidor local, si falla usa el remoto
async function fetchData(endpoint) {
    try {
        const res = await fetch(`${baseLocal}/${endpoint}`);
        if (!res.ok) throw new Error("Local API offline");
        return await res.json();
    } catch (error) {
        console.warn("Usando API remota por fallback");
        const res = await fetch(`${baseRemote}/${endpoint}`);
        return await res.json();
    }
}
