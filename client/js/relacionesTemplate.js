// relacionesTemplate.js
export function crearRelacionHTML({ target, type, description }) {
    console.log("Generando HTML para relación:", target, type, description);
    return `
      <div class="relacion">
        <h3>${target} - <span class="tipo">${type}</span></h3>
        <p>${description}</p>
      </div>
    `;
}
