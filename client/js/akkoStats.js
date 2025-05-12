fetch("./api/stats/akko.json")
    .then((res) => res.json())
    .then((data) => {
        const ctx = document.getElementById("myChart").getContext("2d");

        new Chart(ctx, {
            type: "radar",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: data.name,
                        data: data.stats,
                        backgroundColor: "rgba(221, 139, 17, 0.3)",
                        borderColor: "rgba(211, 127, 18, 0.8)",
                        borderWidth: 2,
                        pointBackgroundColor: "rgb(151, 30, 30)",
                        pointBorderColor: "white",
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointHoverBorderWidth: 3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        suggestedMin: 0,
                        suggestedMax: 100,
                        angleLines: { color: "rgba(173, 216, 230, 0.5)" },
                        grid: { color: "rgba(255, 255, 255, 0.3)" },
                        ticks: { display: false },
                        pointLabels: {
                            color: "#FFD700",
                            font: {
                                size: 16,
                                weight: "bold",
                                family: "cursive",
                            },
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
    });
