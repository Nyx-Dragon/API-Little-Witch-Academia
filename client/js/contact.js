document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validación opcional adicional
        if (!name || !email || !message) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await fetch(
                "https://api-little-witch-academia.onrender.com/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, message }),
                }
            );

            if (!response.ok) throw new Error("Fallo en el servidor");

            const data = await response.json();
            alert(data.message);
            form.reset(); // Limpiar formulario tras enviar
        } catch (error) {
            alert("Error al enviar el mensaje. Intenta más tarde.");
            console.error(error);
        }
    });
});
