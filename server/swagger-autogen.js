// server/swagger-autogen.js
const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Little Witch Academia API",
        description:
            "Documentación generada automáticamente con swagger-autogen",
    },
    host: "localhost:3000", // cambia a tu dominio en producción si es necesario
    schemes: ["http"],
};

const outputFile = "./server/swagger-output.json"; // archivo que se generará
const endpointsFiles = ["./index.js", "./api/routes/contact.routes.js"]; // archivos donde tienes las rutas

swaggerAutogen(outputFile, endpointsFiles, doc);
