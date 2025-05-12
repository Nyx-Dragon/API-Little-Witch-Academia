import { renderizarGraficoDesdeAPI } from "./chartLoader.js";
import { mostrarRelacionesDesdeAPI } from "./relacionesLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  renderizarGraficoDesdeAPI("../server/api/stats/akko.json");
  mostrarRelacionesDesdeAPI("../server/api/relacion/akko.json");
});
