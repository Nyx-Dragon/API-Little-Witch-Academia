document.addEventListener("DOMContentLoaded", function () {
    initImageHandling();
    initButtonHandling();
    initMusicControls();
});

// Añade la clase "visible" a la imagen cargada
function handleImageLoad(image) {
    image.classList.add("visible");
}

// Inicializa el manejo de imágenes
function initImageHandling() {
    const images = document.querySelectorAll(".character-img");
    images.forEach(image => {
        image.addEventListener("load", () => handleImageLoad(image));
        if (image.complete) {
            handleImageLoad(image);
        }
    });
}

// Maneja el clic en el botón de edición
function handleEditButtonClick(card) {
    const name = card.getAttribute("data-name");
    let newRole = prompt(`Editar descripción de ${name}:`, card.getAttribute("data-role"));
    
    while (newRole && newRole.trim() === "") {
        alert("La descripción no puede estar vacía. Introduce una descripción válida.");
        newRole = prompt(`Editar descripción de ${name}:`, card.getAttribute("data-role"));
    }

    if (newRole) {
        card.querySelector("p").textContent = newRole;
        card.setAttribute("data-role", newRole);
    }
}

// Maneja el clic en el botón de eliminación
function handleDeleteButtonClick(card) {
    const name = card.getAttribute("data-name");
    if (confirm(`¿Seguro que deseas eliminar a ${name}?`)) {
        card.remove();
    }
}

// Inicializa el manejo de botones de edición y eliminación
function initButtonHandling() {
    const characters = document.querySelectorAll(".character-card");
    characters.forEach(card => {
        const editButton = card.querySelector(".edit-btn");
        const deleteButton = card.querySelector(".delete-btn");

        if (editButton) editButton.addEventListener("click", () => handleEditButtonClick(card));
        if (deleteButton) deleteButton.addEventListener("click", () => handleDeleteButtonClick(card));
    });
}

// Inicializa el reproductor de música
function initMusicControls() {
    const audio = document.getElementById("background-music");
    const playButton = document.getElementById("play-music");
    const volumeControl = document.getElementById("volume-control");

    if (playButton && audio) {
        playButton.addEventListener("click", function () {
            if (audio.paused) {
                audio.play();
                audio.loop = true;  // Activa el bucle
                playButton.textContent = "Pausar";
            } else {
                audio.pause();
                audio.loop = false;  // Desactiva el bucle
                playButton.textContent = "Reproducir";
            }
        });
    }

    if (volumeControl && audio) {
        volumeControl.addEventListener("input", function () {
            audio.volume = volumeControl.value;
        });
    }
}

// Maneja el envío del formulario
document.getElementById("upload-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const imageFile = document.getElementById("image-upload").files[0];
    const characterName = document.getElementById("character-name").value;
    const characterRole = document.getElementById("character-role").value;

    if (imageFile && characterName && characterRole) {
        // Crear un objeto URL para la imagen cargada
        const imageUrl = URL.createObjectURL(imageFile);

        // Crear una nueva tarjeta de personaje
        const newCard = document.createElement("div");
        newCard.classList.add("character-card");

        // Crear el contenido de la tarjeta
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

        // Añadir la nueva tarjeta a la sección de personajes
        document.querySelector(".character-container").appendChild(newCard);

        // Limpiar el formulario
        document.getElementById("upload-form").reset();

        // Re-inicializa los botones para que los nuevos botones de editar y eliminar funcionen
        initButtonHandling();
    } else {
        alert("Por favor, completa todos los campos.");
    }
});
