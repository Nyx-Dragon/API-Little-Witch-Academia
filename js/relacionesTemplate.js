export function crearRelacionHTML({ target, type, description }) {
    return `
      <div class="relacion">
        <h3>${target} - <span class="tipo">${type}</span></h3>
        <p>${description}</p>
      </div>
    `;
  }
  