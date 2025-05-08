// Delegación de eventos para los botones de edición y eliminación
document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".character-container");

    container.addEventListener("click", function(event) {
        const card = event.target.closest(".character-card");
        if (!card) return;

        if (event.target.classList.contains("edit-btn")) {
            handleEditButtonClick(card);
        } else if (event.target.classList.contains("delete-btn")) {
            handleDeleteButtonClick(card);
        }
    });

    // Inicializa música al cargar
    initMusicControls();
});

function initMusicControls() {
    const audio = document.getElementById("background-music");
    const playButton = document.getElementById("play-music");
    const volumeControl = document.getElementById("volume-control");

    if (audio) {
        playButton.addEventListener("click", function () {
            if (audio.paused) {
                audio.play().catch(error => console.error("Error al reproducir música:", error));
                audio.loop = true;
                playButton.textContent = "Pausar";
            } else {
                audio.pause();
                audio.loop = false;
                playButton.textContent = "Reproducir";
            }
        });

        volumeControl.addEventListener("input", function () {
            audio.volume = volumeControl.value;
        });
    }
}

document.getElementById("upload-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const imageFile = document.getElementById("image-upload").files[0];
    const characterName = document.getElementById("character-name").value;
    const characterRole = document.getElementById("character-role").value;

    if (imageFile && characterName && characterRole) {
        if (!imageFile.type.startsWith("image/")) {
            alert("Por favor, selecciona un archivo de imagen válido.");
            return;
        }

        const imageUrl = URL.createObjectURL(imageFile);
        const newCard = document.createElement("div");
        newCard.classList.add("character-card");

        newCard.innerHTML = `
            <a href="#">
                <img class="character-img" src="${imageUrl}" alt="${characterName}" loading="lazy" />
            </a>
            <h2 class="character-name">${characterName}</h2>
            <p class="character-description">${characterRole}</p>
            <div class="buttons">
                <button class="edit-btn"><i class="fa fa-pencil"></i> Editar</button>
                <button class="delete-btn"><i class="fa fa-trash"></i> Borrar</button>
            </div>
        `;

        document.querySelector(".character-container").appendChild(newCard);
        document.getElementById("upload-form").reset();
        initButtonHandling();
    } else {
        alert("Por favor, completa todos los campos.");
    }
});