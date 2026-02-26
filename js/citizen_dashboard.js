document.addEventListener("DOMContentLoaded", function () {

    const pageContent = document.getElementById("pageContent");

    /* =========================
       NAVIGATION ANIMATION
    ========================== */

    document.querySelectorAll(".nav-links a, .logo").forEach(el => {
        el.addEventListener("click", function (e) {

            const target =
                el.dataset.link || el.getAttribute("href");

            if (!target) return;

            e.preventDefault();
            pageContent.classList.add("page-fade-out");

            setTimeout(() => {
                window.location.href = target;
            }, 450);
        });
    });

    /* =========================
       USERNAME DISPLAY
    ========================== */

    const username = localStorage.getItem("citizenName");

    if (username) {
        document.getElementById("usernameDisplay").innerText = username;
    } else {
        document.getElementById("usernameDisplay").innerText = "Citizen";
    }

    /* =========================
       LOGOUT
    ========================== */

    document.getElementById("logoutBtn").addEventListener("click", () => {

        localStorage.removeItem("citizenName");

        pageContent.classList.add("page-fade-out");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 450);
    });

    /* =========================
   HEATMAP FIXED VERSION
========================= */

const map = L.map('map').setView([23.2599, 77.4126], 14); // Zoomed to city level

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

/*
   All points very close to each other
   So density becomes visible
*/

const crimeData = [

    // Area 1 – Peer Gate (High crime)
    [23.2599, 77.4126, 1.0],
    [23.2602, 77.4130, 1.0],
    [23.2605, 77.4120, 1.0],

    // Area 2 – MP Nagar (Medium crime)
    [23.2330, 77.4340, 0.7],
    [23.2335, 77.4345, 0.7],

    // Area 3 – Lalghati (Low crime)
    [23.2800, 77.3500, 0.4],
    [23.2810, 77.3510, 0.4],

    // Area 4 – Kolar (Very low)
    [23.2000, 77.4800, 0.2]
];

L.heatLayer(crimeData, {
    radius: 35,   // MUCH bigger
    blur: 30,
    maxZoom: 17,
    max: 1.0,
    gradient: {
        0.2: 'yellow',
        0.4: 'orange',
        0.6: 'darkorange',
        0.8: 'red',
        1.0: '#8B0000'
    }
}).addTo(map);
});