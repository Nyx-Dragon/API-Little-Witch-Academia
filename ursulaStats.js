document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("statsChart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: [
                "Poder Mágico",
                "Determinación",
                "Creatividad",
                "Trabajo en equipo",
                "Habilidades de Vuelo"
            ],
            datasets: [{
                label: "Estadísticas Sucy",
                data: [75, 90, 65, 50, 75],
                backgroundColor: "rgba(147, 112, 219, 0.3)",
                borderColor: "rgba(147, 112, 219, 0.8)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(255, 215, 0, 1)",
                pointBorderColor: "white",
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 3
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
});