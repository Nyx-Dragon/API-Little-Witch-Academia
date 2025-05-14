const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");
app.use(cors());
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middleware
app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

// Lista de secciones válidas
const validSections = ["characters", "relation", "spells", "stats", "extra"];

// Endpoint para JSON
app.get("/api/:section", async (req, res) => {
    try {
        const section = req.params.section;
        const filePath = path.join(__dirname, `api/${section}/index.json`);

        // Verify the file exists before sending
        await fs.promises.access(filePath);

        // Explicitly set content-type
        res.type("json").sendFile(filePath);
    } catch (err) {
        // Return proper JSON error response
        res.status(404).json({
            error: "Section not found or data unavailable",
            details: err.message,
        });
    }
});
// Endpoint para vistas HTML
app.get("/api/:section/view", async (req, res) => {
    try {
        const { section } = req.params;

        if (!validSections.includes(section)) {
            return res.status(404).send("Section not found");
        }

        const filePath = path.join(__dirname, "api", section, "index.html");
        await fs.access(filePath);
        res.sendFile(filePath);
    } catch (err) {
        res.status(err.code === "ENOENT" ? 404 : 500).send(
            err.code === "ENOENT" ? "File not found" : "Server error"
        );
    }
});

// Fallback para SPA
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
