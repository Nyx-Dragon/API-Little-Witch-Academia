const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware para parsear JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para manejar el formulario de contacto (privado)
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    const newMessage = {
        name,
        email,
        message,
        date: new Date().toISOString(),
    };

    const filePath = path.join(__dirname, "data", "contact_messages.json");

    try {
        let messages = [];
        try {
            const fileContent = await fs.readFile(filePath, "utf8");
            messages = JSON.parse(fileContent);
        } catch (err) {
            if (err.code !== "ENOENT") throw err;
        }

        messages.push(newMessage);

        await fs.writeFile(filePath, JSON.stringify(messages, null, 2), "utf8");

        console.log("Nuevo mensaje guardado:", newMessage);

        res.json({
            message:
                "Tu mensaje ha sido recibido y guardado. ¡Gracias por contactarnos!",
        });
    } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        res.status(500).json({
            error: "Ocurrió un error al guardar tu mensaje. Inténtalo más tarde.",
        });
    }
});

// Devuelve el path al JSON de una sección
function getSectionFilePath(section) {
    return path.join(__dirname, "api", section, "index.json");
}

// Middleware para bloquear cualquier acceso a /api/contact*
app.use("/api/contact", (req, res) => {
    res.status(403).json({ error: "Acceso prohibido a la sección 'contact'" });
});

// Ruta para servir los archivos estáticos del cliente
app.use(express.static(path.join(__dirname, "../client")));

// Ruta principal de cada sección
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

// Ruta para ver contenido de sección
app.get("/api/:section/view", async (req, res) => {
    const section = req.params.section;

    if (section.toLowerCase() === "contact") {
        return res.status(403).json({ error: "Acceso prohibido a 'contact'" });
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

// Ruta para archivos JSON individuales
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

// Manejo de errores internos
app.use((err, req, res, next) => {
    console.error("Error interno:", err);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Ruta no encontrada dentro de /api
app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "Ruta de API no encontrada" });
});

// Fallback para SPA (Single Page Application)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
