// relacionesLoader.js
import { crearRelacionHTML } from "./relacionesTemplate.js";

console.log("relacionesLoader cargado");

fetch("./api/relacion/akko.json")
  .then((res) => res.json())
  .then((relaciones) => {
    console.log("Datos de relaciones:", relaciones);

    if (relaciones.relations && Array.isArray(relaciones.relations)) {
        const container = document.getElementById("relacionesContainer");
        if (!container) {
          console.error("No se encontró el contenedor de relaciones");
          return;
        }

      relaciones.relations.forEach((relacion) => {
        console.log("Procesando relación:", relacion); 
        
        const html = crearRelacionHTML(relacion);
        
        const div = document.createElement("div");
        div.innerHTML = html; 
        container.appendChild(div.firstChild);
      });
    } else {
      console.error("Las relaciones no están en el formato esperado.");
    }
  })
  .catch((error) => {
    console.error("Error al cargar las relaciones:", error);
  });
