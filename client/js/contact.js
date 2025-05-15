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

        const data = { name, email, message };

        console.log("Datos a enviar:", data);

        fetch("https://api-little-witch-academia.onrender.com/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Respuesta del servidor:", data);
                document.getElementById(
                    "form-response"
                ).innerHTML = `<p class="success">${data.message}</p>`;
                document.getElementById("contact-form").reset();
            })
            .catch((error) => {
                console.error("Error al enviar el formulario:", error);
                document.getElementById(
                    "form-response"
                ).innerHTML = `<p class="error">Hubo un problema al enviar tu mensaje. Intenta nuevamente más tarde.</p>`;
            });
    });
