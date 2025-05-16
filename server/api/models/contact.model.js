require("dotenv").config();
const mysql = require("mysql2/promise");

// Conexión a la base de datos usando variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "contactmessage",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Función para guardar un mensaje en la base de datos
async function saveMessage({ name, email, message }) {
    const sql = `
        INSERT INTO messages (name, email, message, date)
        VALUES (?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(sql, [name, email, message]);
    return result.insertId;
}

module.exports = {
    saveMessage,
};
