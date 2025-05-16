const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "contactmessage",
});

async function saveMessage({ name, email, message }) {
    const sql =
        "INSERT INTO messages (name, email, message, date) VALUES (?, ?, ?, NOW())";
    const [result] = await pool.execute(sql, [name, email, message]);
    return result.insertId;
}

module.exports = {
    saveMessage,
};
