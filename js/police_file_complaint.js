document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("policeToken");

    if (!token) {
        alert("Unauthorized");
        window.location.href = "index.html";
        return;
    }

    // Logout
    document.getElementById("logoutBtn")
        .addEventListener("click", () => {
            localStorage.removeItem("policeToken");
            localStorage.removeItem("policeUsername");
            window.location.href = "index.html";
        });

    // Submit Complaint
    document.getElementById("submitPoliceComplaint")
        .addEventListener("click", async () => {

        const victimName =
            document.getElementById("victimName").value.trim();

        const victimMobile =
            document.getElementById("victimMobile").value.trim();

        const title =
            document.getElementById("complaintTitle").value.trim();

        const description =
            document.getElementById("complaintDescription").value.trim();

        const latitude =
            document.getElementById("complaintLat").value;

        const longitude =
            document.getElementById("complaintLng").value;

        if (!victimName || !victimMobile ||
            !title || !description) {

            alert("Please fill all required fields");
            return;
        }

        const response = await fetch(
            "http://127.0.0.1:8000/api/police/complaints/police-create/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    citizen_name: victimName,
                    mobile_number: victimMobile,
                    title: title,
                    description: description,
                    latitude: latitude || null,
                    longitude: longitude || null
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Complaint registered successfully");
            window.location.href = "police_dashboard.html";
        } else {
            alert(data.error || "Error filing complaint");
        }
    });

});