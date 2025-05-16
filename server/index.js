require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const contactRoutes = require("./api/routes/contact.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos del cliente
app.use(express.static(path.join(__dirname, "../client")));

// Rutas del formulario de contacto (POST /contact)
app.use("/contact", contactRoutes);

// Función para obtener la ruta de un archivo JSON por sección
function getSectionFilePath(section) {
    return path.join(__dirname, "api", section, "index.json");
}

// Ruta para obtener un index.json de sección
app.get("/api/:section", async (req, res, next) => {
    const section = req.params.section;

    if (section.toLowerCase() === "contact") {
        return res.status(403).json({ error: "Acceso prohibido a 'contact'" });
    }

    const filePath = getSectionFilePath(section);
    try {
        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
        next(err);
    }
});

// Ruta para obtener un archivo JSON específico de una sección
app.get("/api/:section/:file", async (req, res) => {
    const { section, file } = req.params;

    if (section.toLowerCase() === "contact") {
        return res.status(403).json({ error: "Acceso prohibido a 'contact'" });
    }

    if (file.includes("..") || path.extname(file) !== ".json") {
        return res.status(400).json({ error: "Nombre de archivo inválido" });
    }

    const filePath = path.join(__dirname, "api", section, file);
    try {
        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
        res.status(404).json({
            error: "Archivo JSON no encontrado",
            details: err.message,
        });
    }
});

// Ruta fallback para SPA (cliente)
app.get("*", (req, res, next) => {
    if (
        req.method === "GET" &&
        !req.path.startsWith("/api") &&
        !req.path.startsWith("/contact")
    ) {
        return res.sendFile(path.join(__dirname, "../client/index.html"));
    }
    next();
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error("Error interno:", err);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
