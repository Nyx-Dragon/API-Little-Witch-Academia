// contact.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("contact.js cargado");
});

document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        const data = {
            name,
            email,
            message,
        };

        console.log("Datos a enviar:", data);

        // Enviar la solicitud POST al servidor
        fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Respuesta del servidor:", data);
                // Mostrar mensaje de éxito
                document.getElementById(
                    "form-response"
                ).innerHTML = `<p>${data.message}</p>`;
            })
            .catch((error) => {
                console.error("Error al enviar el formulario:", error);
                // Mostrar mensaje de error
                document.getElementById("form-response").innerHTML =
                    "<p>Hubo un problema al enviar tu mensaje. Intenta nuevamente más tarde.</p>";
            });
    });
