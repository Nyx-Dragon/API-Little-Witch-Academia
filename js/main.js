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

// Función para manejar el clic en el botón de editar
function handleEditButtonClick(card) {
    const characterName = card.querySelector(".character-name").textContent;
    const characterRole = card.querySelector(".character-description").textContent;

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

// Función para manejar la subida de imágenes de personajes
document.getElementById("upload-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const imageInput = document.getElementById("image-upload");
    const nameInput = document.getElementById("character-name");
    const roleInput = document.getElementById("character-role");

    const imageFile = imageInput.files[0];
    const characterName = nameInput.value.trim();
    const characterRole = roleInput.value.trim();

    if (imageFile && characterName && characterRole) {
        // Crear un nuevo contenedor de personaje
        const newCard = document.createElement("div");
        newCard.classList.add("character-card");

        // Agregar imagen
        const newImage = document.createElement("img");
        newImage.classList.add("character-img");
        newImage.src = URL.createObjectURL(imageFile);
        newImage.alt = characterName;

        // Agregar nombre y rol
        const newName = document.createElement("h2");
        newName.classList.add("character-name");
        newName.textContent = characterName;

        const newRole = document.createElement("p");
        newRole.classList.add("character-description");
        newRole.textContent = characterRole;

        // Agregar botones de editar y eliminar
        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.innerHTML = '<i class="fa fa-pencil"></i> Editar';

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.innerHTML = '<i class="fa fa-trash"></i> Borrar';

        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);

        // Agregar elementos al nuevo contenedor
        newCard.appendChild(newImage);
        newCard.appendChild(newName);
        newCard.appendChild(newRole);
        newCard.appendChild(buttonsDiv);

        // Agregar el nuevo personaje a la galería
        document.querySelector(".character-container").appendChild(newCard);

        // Limpiar formulario
        imageInput.value = "";
        nameInput.value = "";
        roleInput.value = "";
    } else {
        alert("Por favor, completa todos los campos.");
    }
});
