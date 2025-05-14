console.log("contact.js cargado");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado");

    const form = document.getElementById("contact-form");
    if (!form) {
        console.error("Formulario no encontrado");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) {
            console.warn("Email inválido");
            alert("Por favor, introduce un correo electrónico válido.");
            return;
        }

        const data = { name, email, message };
        console.log("Datos a enviar:", data);

        try {
            const response = await fetch(
                "https://api-little-witch-academia.onrender.com/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (response.ok) {
                alert(result.message);
            } else {
                alert("Hubo un error al enviar el mensaje.");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error al enviar el mensaje.");
        }
    });
});
