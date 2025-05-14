// server/server.js
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises; // Usar fs.promises para async/await
const path = require("path");

const app = express();
const PORT = 3000;

// Las carpetas válidas que existen en /server/api/
const validSections = ["characters", "relations", "spells", "stats"]; // ← Ajusta según tus carpetas reales

// Devuelve el path al JSON principal de la sección (por ejemplo: about/about.json)
function getSectionFilePath(section) {
    return path.join(__dirname, "api", section, `${section}.json`);
}

// Middleware para parsear el cuerpo de la solicitud
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para servir el archivo HTML y los recursos estáticos
app.use(express.static(path.join(__dirname, "../client")));

// Ruta para obtener sección principal
app.get("/api/:section", async (req, res, next) => {
    const section = req.params.section;

    if (!validSections.includes(section)) {
        return res.status(404).json({ error: "Sección inválida" });
    }

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

    if (!validSections.includes(section)) {
        return res.status(404).send("Sección no encontrada");
    }

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

// Ruta para archivos individuales
app.get("/api/:section/:file", async (req, res) => {
    const { section, file } = req.params;

    if (!validSections.includes(section)) {
        return res.status(404).json({ error: "Sección inválida" });
    }

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
