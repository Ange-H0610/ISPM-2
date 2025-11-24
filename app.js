/* ====== MONTHLY CHART ====== */
const ctx = document.getElementById("monthlyChart");

new Chart(ctx, {
    type: "line",
    data: {
        labels: [
            "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025",
            "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025",
            "Oct 2025", "Nov 2025"
        ],
        datasets: [
            {
                label: "Revenus",
                data: [0,0,0,0,0,0,0,0,0,0,0,0],
                borderColor: "#05c46b",
                backgroundColor: "rgba(5,196,107,0.2)",
                borderWidth: 3,
                tension: 0.4,
            },
            {
                label: "Dépenses",
                data: [0,0,0,0,0,0,0,0,0,0,0,0],
                borderColor: "#ff3d57",
                backgroundColor: "rgba(255,61,87,0.2)",
                borderWidth: 3,
                tension: 0.4,
            },
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { font: { size: 12 } }
            },
            x: {
                ticks: { font: { size: 12 } }
            }
        }
    }
});

/* ====== PIE CHART – EXPENSE CATEGORY ====== */
new Chart(document.getElementById("expenseCatChart"), {
    type: "pie",
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ["#ff3d57", "#ff767f", "#ff9aa2"]
        }]
    },
    options: { responsive: true }
});

/* ====== PIE CHART – INCOME CATEGORY ====== */
new Chart(document.getElementById("incomeCatChart"), {
    type: "pie",
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ["#05c46b", "#69e5a4", "#9df0c7"]
        }]
    },
    options: { responsive: true }
});
