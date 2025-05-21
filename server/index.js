require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const contactRoutes = require("./api/routes/contact.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para servir archivos estáticos del cliente
app.use(express.static(path.join(__dirname, "../client")));

// Rutas del formulario de contacto (POST /contact)
app.use("/contact", contactRoutes);

// Función para obtener la ruta de un archivo JSON por sección
function getSectionFilePath(section) {
    return path.join(__dirname, "api", section, "index.json");
}

/**
 * @swagger
 * /api/{section}:
 *   get:
 *     summary: Obtener el archivo index.json de una sección
 *     tags: [Secciones]
 *     parameters:
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la sección (por ejemplo: stats, gallery)
 *     responses:
 *       200:
 *         description: Archivo JSON enviado correctamente
 *       403:
 *         description: Acceso prohibido a 'contact'
 *       404:
 *         description: Archivo no encontrado
 */
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

/**
 * @swagger
 * /api/{section}/{file}:
 *   get:
 *     summary: Obtener un archivo JSON específico dentro de una sección
 *     tags: [Secciones]
 *     parameters:
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la sección (por ejemplo: stats, gallery)
 *       - in: path
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del archivo JSON (por ejemplo: personaje1.json)
 *     responses:
 *       200:
 *         description: Archivo JSON enviado correctamente
 *       400:
 *         description: Nombre de archivo inválido
 *       403:
 *         description: Acceso prohibido a 'contact'
 *       404:
 *         description: Archivo JSON no encontrado
 */
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
