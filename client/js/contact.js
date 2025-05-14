// Asegúrate de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    // Asumiendo que tu formulario tiene los campos con id="name", id="email" e id="message"
    document
        .getElementById("contact-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            const data = {
                name,
                email,
                message,
            };

            try {
                const response = await fetch(
                    "https://api-little-witch-academia.onrender.com/contact",
                    {
                        // Cambia a la URL de producción si es necesario
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    }
                );

                const result = await response.json();
                if (response.ok) {
                    alert(result.message); // Muestra un mensaje de éxito
                } else {
                    alert("Hubo un error al enviar el mensaje.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error al enviar el mensaje.");
            }
        });
});
