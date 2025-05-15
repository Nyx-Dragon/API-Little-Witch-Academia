// server/api/controllers/contact.controller.js
const { saveMessage } = require("../models/contact.model");

const handleContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    const newMessage = {
        name,
        email,
        message,
        date: new Date().toISOString(),
    };

    try {
        await saveMessage(newMessage);
        console.log("Mensaje guardado:", newMessage);
        res.status(200).json({
            message: "Tu mensaje ha sido recibido. ¡Gracias por contactarnos!",
        });
    } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        res.status(500).json({
            error: "Ocurrió un error al guardar tu mensaje.",
        });
    }
};

module.exports = { handleContactForm };
