// server/api/models/contact.model.js
const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../../data/contact_messages.json");

async function saveMessage(message) {
    let messages = [];
    try {
        const data = await fs.readFile(filePath, "utf8");
        messages = JSON.parse(data);
    } catch (error) {
        if (error.code !== "ENOENT") throw error; // Si no existe, se crea
    }

    messages.push(message);
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2), "utf8");
}

module.exports = { saveMessage };
