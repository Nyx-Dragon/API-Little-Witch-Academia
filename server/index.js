const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");
const morgan = require("morgan"); // Opcional, para logs

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
const clientPath = path.resolve(__dirname, "..", "client");
app.use(express.static(clientPath));
app.use(morgan("dev")); // Para ver las peticiones en consola

// Secciones válidas
const validSections = ["characters", "relations", "spells", "stats", "extra"];

// Función auxiliar para construir la ruta del JSON principal de sección
const getSectionFilePath = (section) =>
    path.join(__dirname, "api", section, "index.json");

// Ruta principal: /api/:section
app.get("/api/:section", async (req, res) => {
    try {
        const section = req.params.section;

        if (!validSections.includes(section)) {
            return res.status(404).json({ error: "Invalid section" });
        }

        const filePath = getSectionFilePath(section);
        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
        console.error(err);
        res.status(404).json({
            error: "Section not found or data unavailable",
            details: err.message,
        });
    }
});

// Ruta para ver JSON crudo: /api/:section/view
app.get("/api/:section/view", async (req, res) => {
    try {
        const section = req.params.section;

        if (!validSections.includes(section)) {
            return res.status(404).send("Section not found");
        }

        const filePath = getSectionFilePath(section);
        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
        console.error(err);
        res.status(err.code === "ENOENT" ? 404 : 500).send(
            err.code === "ENOENT" ? "File not found" : "Server error"
        );
    }
});

// Ruta para archivos individuales: /api/:section/:file
app.get("/api/:section/:file", async (req, res) => {
    try {
        const { section, file } = req.params;

        if (!validSections.includes(section)) {
            return res.status(404).json({ error: "Invalid section" });
        }

        // Seguridad: evitar path traversal y validar extensión .json
        if (file.includes("..") || path.extname(file) !== ".json") {
            return res
                .status(400)
                .json({ error: "Invalid file name or extension" });
        }

        const filePath = path.join(__dirname, "api", section, file);
        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
        console.error(err);
        res.status(404).json({
            error: "JSON file not found",
            details: err.message,
        });
    }
});

// Ruta no encontrada para la API
app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
});

// Fallback SPA para rutas desconocidas (React/Vue/HTML5 history)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.json());

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    // Puedes guardar esto en un archivo, base de datos, o mandarlo por email
    console.log("Nuevo mensaje recibido:");
    console.log("Nombre:", name);
    console.log("Email:", email);
    console.log("Mensaje:", message);

    res.json({ message: "Gracias por tu mensaje. ¡Te responderemos pronto!" });
});
