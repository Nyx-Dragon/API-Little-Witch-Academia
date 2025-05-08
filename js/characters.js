document.addEventListener("DOMContentLoaded", function () {
    // Obtener el nombre del archivo actual
    const filename = window.location.pathname.split("/").pop();
    const personaje = filename.replace(".html", "").toLowerCase();

    fetch(`./api/stats/${personaje}.json`)
    .then(res => res.json())
    .then(data => {
        const stats = {};
        data.labels.forEach((label, i) => {
            stats[label] = data.stats[i];
        });
        renderizarGrafico(stats);
    });


    // Cargar relaciones (archivo JSON)
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
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10
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
        div.innerHTML = `
            <h3>${relacion.nombre}</h3>
            <p><b>Relación:</b> ${relacion.tipo}</p>
            <p>${relacion.descripcion}</p>
        `;
        contenedor.appendChild(div);
    });
}
