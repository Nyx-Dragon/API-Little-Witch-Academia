document.addEventListener("DOMContentLoaded", () => {
    console.log("contact.js cargado");

    const form = document.getElementById("contact-form");
    if (!form) {
        console.warn("Formulario no encontrado");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            alert("Por favor, rellena todos los campos.");
            return;
        }

        const data = { name, email, message };

        // Detectar si estamos en localhost o en producción
        const baseURL = location.hostname.includes("localhost")
            ? "http://localhost:3000"
            : "https://api-little-witch-academia.onrender.com";

        try {
            const res = await fetch(`${baseURL}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const resData = await res.json();

            if (!res.ok) {
                throw new Error(
                    resData?.error || "Error al enviar el formulario"
                );
            }

            console.log("Respuesta del servidor:", resData);
            document.getElementById(
                "form-response"
            ).innerHTML = `<p class="success">${resData.message}</p>`;
            form.reset();
        } catch (err) {
            console.error("Error al enviar:", err);
            document.getElementById(
                "form-response"
            ).innerHTML = `<p class="error">Hubo un problema al enviar tu mensaje. Intenta nuevamente más tarde.</p>`;
        }
    });
});
