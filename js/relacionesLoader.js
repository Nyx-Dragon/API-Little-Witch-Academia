import { crearRelacionHTML } from "./relacionesTemplate.js";
console.log(crearRelacionHTML);
export function mostrarRelacionesDesdeAPI(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("relacionesContainer");
      container.innerHTML = "";

      data.relations.forEach(rel => {
        container.innerHTML += crearRelacionHTML(rel);
      });
    })
    .catch(err => console.error("Error al cargar relaciones:", err));
}
