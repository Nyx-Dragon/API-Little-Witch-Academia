const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");
const morgan = require("morgan");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const corsOptions = {
    origin: [
        "https://api-little-witch-academia.onrender.com",
        "http://localhost:3000",
        "http://127.0.0.1:5503",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
const clientPath = path.resolve(__dirname, "..", "client");
app.use(express.static(clientPath));
app.use(morgan("dev"));

// Rutas permitidas para proxy
const allowedProxyTargets = ["https://api-little-witch-academia.onrender.com"];

app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url;

    if (
        !targetUrl ||
        !allowedProxyTargets.some((url) => targetUrl.startsWith(url))
    ) {
        return res
            .status(400)
            .json({ error: "URL no permitida o faltante en proxy" });
    }

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            return res.status(response.status).json({
                error: `Error al hacer fetch: ${response.statusText}`,
            });
        }

        const contentType =
            response.headers.get("content-type") || "application/json";
        res.set("Content-Type", contentType);
        const body = await response.text();
        res.send(body);
    } catch (err) {
        console.error("Error en proxy:", err);
        res.status(500).json({ error: "Error interno al usar el proxy" });
    }
});

// Secciones válidas
const validSections = ["characters", "relations", "spells", "stats", "extra"];
const getSectionFilePath = (section) =>
    path.join(__dirname, "api", section, "index.json");

// Ruta para contacto
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;
    console.log("Datos recibidos:", req.body);

    if (!name || !email || !message) {
        return res
            .status(400)
            .json({ error: "Todos los campos son requeridos" });
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
        return res.status(400).json({ error: "Email no válido" });
    }

    const newMessage = {
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
    };

    const filePath = path.join(__dirname, "contact_messages.json");

    try {
        let messages = [];
        try {
            const data = await fs.readFile(filePath, "utf8");
            messages = JSON.parse(data);
        } catch (err) {
            if (err.code !== "ENOENT") throw err;
        }

        messages.push(newMessage);
        await fs.writeFile(filePath, JSON.stringify(messages, null, 2));

        /* // Borrado automático opcional
        setTimeout(async () => {
            try {
                await fs.unlink(filePath);
                console.log("Archivo eliminado automáticamente");
            } catch (error) {
                console.error("Error al eliminar archivo:", error);
            }
        }, 10000); 
        */

        res.json({
            message: "Gracias por tu mensaje. ¡Te responderemos pronto!",
        });
    } catch (err) {
        console.error("Error al guardar el mensaje:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
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

// Ruta no encontrada en API
app.use("/api", (req, res) => {
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
