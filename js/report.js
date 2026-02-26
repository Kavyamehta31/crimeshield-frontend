document.addEventListener("DOMContentLoaded", function () {

    const pageContent = document.getElementById("pageContent");
    const logoutBtn = document.getElementById("logoutBtn");
    const form = document.getElementById("complaintForm");

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
       LOGOUT
    ========================== */

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("citizenName");
        localStorage.removeItem("citizenMobile");

        pageContent.classList.add("page-fade-out");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 450);
    });

    /* =========================
       SUBMIT COMPLAINT
    ========================== */

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let citizenName = localStorage.getItem("citizenName");
        let citizenMobile = localStorage.getItem("citizenMobile");

        /* 🔹 WORKAROUND FOR FILE:// */
        if (!citizenName || !citizenMobile) {

            citizenName = prompt("Enter your full name:");
            citizenMobile = prompt("Enter your mobile number:");

            if (!citizenName || !citizenMobile) {
                alert("Name and mobile are required.");
                return;
            }

            // Save for future use
            localStorage.setItem("citizenName", citizenName);
            localStorage.setItem("citizenMobile", citizenMobile);
        }

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();

        if (!title || !description) {
            alert("Please fill all fields.");
            return;
        }

        if (!navigator.geolocation) {
            alert("Geolocation not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {

            fetch("https://crimeshield-backend.onrender.com/api/police/complaints/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    citizen_name: citizenName,
                    mobile_number: citizenMobile,
                    title: title,
                    description: description,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            })
            .then(res => res.json())
            .then(data => {

                if (data.error) {
                    alert("Error: " + data.error);
                    return;
                }

                alert("Complaint submitted successfully.");

                pageContent.classList.add("page-fade-out");

                setTimeout(() => {
                    window.location.href = "citizen_dashboard.html";
                }, 450);
            })
            .catch(() => {
                alert("Server error. Please try again.");
            });

        }, () => {
            alert("Location permission denied.");
        });

    });

});