document.addEventListener("DOMContentLoaded", function () {
    const filename = window.location.pathname.split("/").pop();
    const personaje = filename.replace(".html", "").toLowerCase();

    const baseURL =
        window.location.hostname === "localhost"
            ? "http://localhost:3000/api"
            : "https://api-little-witch-academia.onrender.com/api";

    // Cargar estadísticas
    fetch(`${baseURL}/stats/${personaje}.json`)
        .then((res) => res.json())
        .then((data) => {
            const stats = {};
            data.labels.forEach((label, i) => {
                stats[label] = data.stats[i];
            });
            renderizarGrafico(stats, personaje);
        })
        .catch((error) =>
            console.error("Error al cargar estadísticas:", error)
        );

    // Cargar relaciones
    fetch(`${baseURL}/relations/${personaje}.json`)
        .then((res) => res.json())
        .then((data) => {
            if (data.relations) {
                mostrarRelaciones(data.relations);
            } else {
                console.error(
                    "No se encontraron relaciones para este personaje."
                );
            }
        })
        .catch((error) => console.error("Error al cargar relaciones:", error));
});

function getColorForPersonaje(personaje) {
    const colores = {
        akko: ["rgba(255, 99, 132, 0.2)", "rgba(255, 99, 132, 1)"],
        sucy: ["rgba(153, 102, 255, 0.2)", "rgba(153, 102, 255, 1)"],
        lotte: ["rgba(255, 206, 86, 0.2)", "rgba(255, 206, 86, 1)"],
        diana: ["rgba(54, 162, 235, 0.2)", "rgba(54, 162, 235, 1)"],
        constanze: ["rgba(255, 105, 180, 0.2)", "rgb(105, 255, 168)"],
        jasminka: ["rgba(255, 69, 0, 0.2)", "rgba(255, 69, 0, 1)"],
        amanda: ["rgba(210, 105, 30, 0.2)", "rgb(255, 115, 0)"],
        ursula: ["rgba(210, 105, 30, 0.2)", "rgb(22, 41, 124)"],
        shiny: ["rgba(255, 99, 71, 0.2)", "rgba(255, 99, 71, 1)"],
        croix: ["rgba(100, 100, 255, 0.2)", "rgba(100, 100, 255, 1)"],
    };

    return (
        colores[personaje] || [
            "rgba(200, 200, 200, 0.2)",
            "rgba(200, 200, 200, 1)",
        ]
    );
}

function renderizarGrafico(stats, personaje) {
    const [bgColor, borderColor] = getColorForPersonaje(personaje);
    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
        type: "radar",
        data: {
            labels: Object.keys(stats),
            datasets: [
                {
                    label: "Estadísticas del Personaje",
                    data: Object.values(stats),
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                    pointBackgroundColor: borderColor,
                },
            ],
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
                        font: { size: 16, weight: "bold", family: "cursive" },
                    },
                },
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#E6E6FA",
                        font: { size: 18, style: "italic" },
                    },
                },
            },
        },
    });
}

function mostrarRelaciones(relaciones) {
    const contenedor = document.getElementById("relacionesContainer");
    relaciones.forEach((relacion) => {
        const div = document.createElement("div");
        div.classList.add("relacion");

        const targetLink = `../html/${relacion.target.toLowerCase()}.html`;

        div.innerHTML = `
            <h3><a href="${targetLink}" class="relacion-link">${relacion.target}</a></h3>
            <p><b>Relación:</b> ${relacion.type}</p>
            <p>${relacion.description}</p>
        `;

        contenedor.appendChild(div);
    });
}
