import { renderizarGraficoDesdeAPI } from "./chartLoader.js";
import { mostrarRelacionesDesdeAPI } from "./relacionesLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  renderizarGraficoDesdeAPI("./api/stats/akko.json");
  mostrarRelacionesDesdeAPI("./api/relacion/akko.json");
});
