// server/index.js
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises; // Usar fs.promises para async/await
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware para parsear el cuerpo de la solicitud
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para manejar el formulario de contacto
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    // Aquí puedes agregar lógica para guardar el mensaje o enviarlo por correo, etc.
    console.log("Nuevo mensaje de contacto:", { name, email, message });

    // Responder con un mensaje de éxito
    res.json({
        message: "Tu mensaje ha sido recibido. ¡Gracias por contactarnos!",
    });
});

// Devuelve el path al JSON de la sección, ahora buscando index.json
function getSectionFilePath(section) {
    return path.join(__dirname, "api", section, "index.json");
}

// Ruta para servir el archivo HTML y los recursos estáticos
app.use(express.static(path.join(__dirname, "../client")));

// Ruta para obtener sección principal
app.get("/api/:section", async (req, res, next) => {
    const section = req.params.section;
    const filePath = getSectionFilePath(section);
    try {
        // Comprobamos si el archivo existe
        console.log(`Comprobando si el archivo existe: ${filePath}`);
        await fs.access(filePath);
        console.log(`Archivo encontrado: ${filePath}`);
        res.type("json").sendFile(filePath);
    } catch (err) {
        console.error(`Error al acceder al archivo: ${err.message}`);
        next(err); // Pasamos el error al middleware de manejo de errores
    }
});

// Ruta para ver contenido JSON
app.get("/api/:section/view", async (req, res) => {
    const section = req.params.section;
    const filePath = getSectionFilePath(section);
    try {
        console.log(`Comprobando si el archivo existe: ${filePath}`);
        await fs.access(filePath);
        console.log(`Archivo encontrado: ${filePath}`);
        res.type("json").sendFile(filePath);
    } catch (err) {
        console.error(`Error al acceder al archivo: ${err.message}`);
        res.status(err.code === "ENOENT" ? 404 : 500).send(
            err.code === "ENOENT"
                ? "Archivo no encontrado"
                : "Error del servidor"
        );
    }
});

// Ruta para archivos individuales (si los hay)
app.get("/api/:section/:file", async (req, res) => {
    const { section, file } = req.params;

    if (file.includes("..") || path.extname(file) !== ".json") {
        return res.status(400).json({ error: "Nombre de archivo inválido" });
    }

    const filePath = path.join(__dirname, "api", section, file);
    try {
        console.log(`Comprobando si el archivo existe: ${filePath}`);
        await fs.access(filePath);
        console.log(`Archivo encontrado: ${filePath}`);
        res.type("json").sendFile(filePath);
    } catch (err) {
        console.error(`Error al acceder al archivo: ${err.message}`);
        res.status(404).json({
            error: "Archivo JSON no encontrado",
            details: err.message,
        });
    }
});

app.use((err, req, res, next) => {
    console.error("Error interno:", err);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Ruta no encontrada en API
app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "Ruta de API no encontrada" });
});

// SPA fallback
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
