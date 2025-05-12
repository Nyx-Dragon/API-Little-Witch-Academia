const API_BASE_URL = "https://api-little-witch-academia.onrender.com/api";

// Configuración global para evitar CORS en desarrollo
const DEV_PROXY = "https://cors-anywhere.herokuapp.com/";
const IS_DEVELOPMENT =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

export const fetchCharacters = async () => {
    try {
        const url = `${
            IS_DEVELOPMENT ? DEV_PROXY : ""
        }${API_BASE_URL}/characters/index.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("La respuesta no es JSON");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al cargar personajes:", error);
        throw error; // Re-lanzamos el error para manejarlo en el componente
    }
};
