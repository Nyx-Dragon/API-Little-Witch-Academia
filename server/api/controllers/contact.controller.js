const { saveMessage } = require("../models/contact.model");

async function handleContactForm(req, res) {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res
                .status(400)
                .json({ error: "Todos los campos son obligatorios" });
        }

        const insertId = await saveMessage({ name, email, message });

        res.json({
            message: "Tu mensaje ha sido guardado exitosamente.",
            id: insertId,
        });
    } catch (err) {
        console.error("Error al guardar mensaje:", err);
        res.status(500).json({ error: "Error al guardar mensaje" });
    }
}

module.exports = {
    handleContactForm,
};
