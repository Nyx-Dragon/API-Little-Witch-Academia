document.addEventListener("DOMContentLoaded", function () {
    // Obtener el nombre del archivo actual
    const filename = window.location.pathname.split("/").pop();
    const personaje = filename.replace(".html", "").toLowerCase();

    // Cargar estadísticas
    fetch(`./api/stats/${personaje}.json`)
        .then(res => res.json())
        .then(data => {
            const stats = {};
            data.labels.forEach((label, i) => {
                stats[label] = data.stats[i];
            });
            renderizarGrafico(stats);
        });

    // Cargar relaciones
    fetch(`./api/relacion/${personaje}.json`)
        .then(res => res.json())
        .then(data => mostrarRelaciones(data.relations));
});

// Función para renderizar gráfico
function renderizarGrafico(stats) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(stats),
            datasets: [{
                label: "Estadísticas del Personaje",
                data: Object.values(stats),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                pointBackgroundColor: "rgba(255, 99, 132, 1)"
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
      };
    
// Función para mostrar relaciones
function mostrarRelaciones(relaciones) {
    const contenedor = document.getElementById('relacionesContainer');
    relaciones.forEach(relacion => {
        const div = document.createElement('div');
        div.classList.add('relacion');
        div.innerHTML = `
            <h3>${relacion.target}</h3>
            <p><b>Relación:</b> ${relacion.type}</p>
            <p>${relacion.description}</p>
        `;
        contenedor.appendChild(div);
    });
}
