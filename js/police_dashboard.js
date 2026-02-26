document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("policeToken");
    const officerName = localStorage.getItem("policeUsername");

    if (!token) {
        alert("Unauthorized. Please login again.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("officerName").innerText = officerName;

    const databaseSection = document.getElementById("databaseSection");
    const databaseContent = document.getElementById("databaseContent");

    // ==============================
    // MAP INITIALIZATION
    // ==============================

    const map = L.map("policeMap").setView([23.1765, 75.7885], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    let markersLayer = L.layerGroup().addTo(map);

    function clearMarkers() {
        markersLayer.clearLayers();
    }

    function addMarker(lat, lng, popupText, color) {
        const marker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: color,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(popupText);

        markersLayer.addLayer(marker);
    }

    // ==============================
    // LOAD COMPLAINTS
    // ==============================

    document.getElementById("loadComplaintsBtn")
        .addEventListener("click", async () => {

        databaseSection.style.display = "block";
        clearMarkers();

        const response = await fetch(
            "http://crimeshield-backend.onrender.com/api/police/complaints/all/",
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            databaseContent.innerHTML = "<p>Error loading complaints</p>";
            return;
        }

        renderComplaints(data.complaints);

        data.complaints.forEach(c => {
            if (c.latitude && c.longitude) {
                addMarker(
                    c.latitude,
                    c.longitude,
                    `<b>Complaint:</b> ${c.title}<br>Status: ${c.status}`,
                    "#ff6600"
                );
            }
        });
    });

    // ==============================
    // LOAD SOS
    // ==============================

    document.getElementById("loadSOSBtn")
        .addEventListener("click", async () => {

        databaseSection.style.display = "block";
        clearMarkers();

        const response = await fetch(
            "http://crimeshield-backend.onrender.com/api/sos/all/",
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            databaseContent.innerHTML = "<p>Error loading SOS</p>";
            return;
        }

        renderSOS(data.sos);

        data.sos.forEach(s => {
            if (s.latitude && s.longitude) {
                addMarker(
                    s.latitude,
                    s.longitude,
                    `<b>SOS Alert</b><br>Status: ${s.status}`,
                    "red"
                );
            }
        });
    });

    // ==============================
    // RENDER COMPLAINTS (CLEAN TABLE)
    // ==============================

function renderComplaints(complaints) {

    let html = `
        <table class="clean-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Title</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    complaints.forEach(c => {
        html += `
            <tr>
                <td>${c.id}</td>
                <td>${c.citizen_name}</td>
                <td>${c.mobile_number}</td>
                <td>${c.title}</td>
                <td>${c.created_at || "-"}</td>
                <td>
                    <span class="status-badge status-${c.status}">
                        ${c.status}
                    </span>
                </td>
                <td>
                    <select onchange="updateComplaint(${c.id}, this.value)">
                        <option value="">Change</option>
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                    </select>
                </td>
            </tr>
        `;
    });

    html += "</tbody></table>";

    databaseContent.innerHTML = html;
}
    // ==============================
    // RENDER SOS (WITH VIDEO LINK)
    // ==============================

function renderSOS(sosList) {

    let html = `
        <table class="clean-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Video</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    sosList.forEach(s => {

        const videoLink = s.video
            ? `<a class="video-link" href="http://127.0.0.1:8000${s.video}" target="_blank">View</a>`
            : "-";

        html += `
            <tr>
                <td>${s.id}</td>
                <td>${s.citizen_name || "-"}</td>
                <td>${s.citizen_mobile || "-"}</td>
                <td>${s.created_at || "-"}</td>
                <td>
                    <span class="status-badge status-${s.status}">
                        ${s.status}
                    </span>
                </td>
                <td>${videoLink}</td>
                <td>
                    <select onchange="updateSOS(${s.id}, this.value)">
                        <option value="">Change</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                    </select>
                </td>
            </tr>
        `;
    });

    html += "</tbody></table>";

    databaseContent.innerHTML = html;
}

    // ==============================
    // LOGOUT
    // ==============================

    document.getElementById("logoutBtn")
        .addEventListener("click", () => {
            localStorage.removeItem("policeToken");
            localStorage.removeItem("policeUsername");
            window.location.href = "index.html";
        });

});


// ==============================
// UPDATE FUNCTIONS
// ==============================

async function updateComplaint(id, status) {

    const token = localStorage.getItem("policeToken");

    await fetch("http://crimeshield-backend.onrender.com/api/police/complaints/update-status/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            complaint_id: id,
            status: status
        })
    });

    alert("Complaint updated");
}


async function updateSOS(id, status) {

    const token = localStorage.getItem("policeToken");

    await fetch("http://crimeshield-backend.onrender.com/api/sos/update-status/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            sos_id: id,
            status: status
        })
    });

    alert("SOS updated");
}