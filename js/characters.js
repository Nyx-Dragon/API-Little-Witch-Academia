document.addEventListener("DOMContentLoaded", function () {
  // Obtener el nombre del archivo actual
  const filename = window.location.pathname.split("/").pop();
  const personaje = filename.replace(".html", "").toLowerCase();

  // Cargar estadísticas
  fetch(`../api/stats/${personaje}.json`)
      .then(res => res.json())
      .then(data => {
          const stats = {};
          data.labels.forEach((label, i) => {
              stats[label] = data.stats[i];
          });
          renderizarGrafico(stats, personaje);
      });

  // Cargar relaciones
  fetch(`../api/relacion/${personaje}.json`)
      .then(res => res.json())
      .then(data => mostrarRelaciones(data.relations));
});

// Obtener color según personaje
function getColorForPersonaje(personaje) {
  const colores = {
      akko: ["rgba(255, 99, 132, 0.2)", "rgba(255, 99, 132, 1)"],
      diana: ["rgba(54, 162, 235, 0.2)", "rgba(54, 162, 235, 1)"],
      sucy: ["rgba(153, 102, 255, 0.2)", "rgba(153, 102, 255, 1)"],
      lotte: ["rgba(255, 206, 86, 0.2)", "rgba(255, 206, 86, 1)"],
      // Añade más personajes aquí
  };

  return colores[personaje] || ["rgba(200, 200, 200, 0.2)", "rgba(200, 200, 200, 1)"];
}

// Función para renderizar gráfico
function renderizarGrafico(stats, personaje) {
  const [bgColor, borderColor] = getColorForPersonaje(personaje);
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
      type: 'radar',
      data: {
          labels: Object.keys(stats),
          datasets: [{
              label: "Estadísticas del Personaje",
              data: Object.values(stats),
              backgroundColor: bgColor,
              borderColor: borderColor,
              borderWidth: 1,
              pointBackgroundColor: borderColor
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
              r: {
                  beginAtZero: true,
                  max: 100,
                  angleLines: { color: "rgba(173, 216, 230, 0.5)" },
                  grid: { color: "rgba(255, 255, 255, 0.3)" },
                  ticks: { display: false },
                  pointLabels: {
                      color: "#FFD700",
                      font: { size: 16, weight: "bold", family: "cursive" }
                  }
              }
          },
          plugins: {
              legend: {
                  labels: {
                      color: "#E6E6FA",
                      font: { size: 18, style: "italic" }
                  }
              }
          }
      }
  });
}

// Función para mostrar relaciones
function mostrarRelaciones(relaciones) {
  const contenedor = document.getElementById('relacionesContainer');
  relaciones.forEach(relacion => {
      const div = document.createElement('div');
      div.classList.add('relacion');

      // Convertir el nombre del personaje relacionado a minúsculas
      const targetLink = `../html/${relacion.target.toLowerCase()}.html`;

      div.innerHTML = `
          <h3><a href="${targetLink}" class="relacion-link">${relacion.target}</a></h3>
          <p><b>Relación:</b> ${relacion.type}</p>
          <p>${relacion.description}</p>
      `;
      contenedor.appendChild(div);
  });
}
