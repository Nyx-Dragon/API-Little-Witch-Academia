const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

// Secciones válidas
const validSections = ["characters", "relation", "spells", "stats", "extra"];

// Endpoint principal
app.get("/api/:section", async (req, res) => {
    try {
        const section = req.params.section;
        const filePath = path.join(__dirname, "api", section, "index.json");

        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
        res.status(404).json({
            error: "Section not found or data unavailable",
            details: err.message,
        });
    }
});

// Vista JSON cruda
app.get("/api/:section/view", async (req, res) => {
    try {
        const { section } = req.params;

        if (!validSections.includes(section)) {
            return res.status(404).send("Section not found");
        }

        const filePath = path.join(__dirname, "api", section, "index.json");
        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
        res.status(err.code === "ENOENT" ? 404 : 500).send(
            err.code === "ENOENT" ? "File not found" : "Server error"
        );
    }
});

// Permite acceder a archivos individuales como akko.json
app.get("/api/:section/:file", async (req, res) => {
    try {
        const { section, file } = req.params;

        // Seguridad: solo permitir archivos .json
        if (!file.endsWith(".json")) {
            return res
                .status(400)
                .json({ error: "Only .json files are allowed" });
        }

        const filePath = path.join(__dirname, "api", section, file);

        await fs.access(filePath);
        res.type("json").sendFile(filePath);
    } catch (err) {
        res.status(404).json({
            error: "JSON file not found",
            details: err.message,
        });
    }
});

// Ruta no encontrada
app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
});

// Fallback SPA
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
