// server/swagger.config.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Little Witch Academia API",
            version: "1.0.0",
            description: "Documentación de la API para el proyecto LWA",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local",
            },
            {
                url: "https://api-little-witch-academia.onrender.com",
                description: "Servidor en Render",
            },
        ],
    },
    apis: ["./api/routes/*.js"], // Apunta a tus rutas con anotaciones JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Enviar un mensaje de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mensaje guardado correctamente
 *       500:
 *         description: Error al guardar el mensaje
 */
