const API_BASE_URL = "https://api-little-witch-academia.onrender.com/api";

export const fetchCharacters = async () => {
    try {
        const url = `${API_BASE_URL}/characters/index.json`;
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
        throw error;
    }
};
