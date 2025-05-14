// server/server.js
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
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

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    // Crear objeto con los datos del formulario
    const newMessage = {
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
    };

    // Ruta al archivo JSON donde se guardarán los mensajes
    const filePath = path.join(__dirname, "../data/contact_messages.json");

    // Leer el archivo JSON y agregar el nuevo mensaje
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Error al leer el archivo." });
        }

        const messages = JSON.parse(data || "[]");
        messages.push(newMessage);

        // Escribir de nuevo los datos al archivo JSON
        fs.writeFile(filePath, JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Error al guardar el mensaje." });
            }

            res.json({
                message: "Gracias por tu mensaje. ¡Te responderemos pronto!",
            });
        });
    });
});

// Ruta para obtener sección principal
app.get("/api/:section", async (req, res, next) => {
    const section = req.params.section;

    if (!validSections.includes(section)) {
        return res.status(404).json({ error: "Sección inválida" });
    }

    const filePath = getSectionFilePath(section);
    try {
        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
        next(err);
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
        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
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
        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
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
