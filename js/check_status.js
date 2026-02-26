document.addEventListener("DOMContentLoaded", function () {

    const pageContent = document.getElementById("pageContent");
    const logoutBtn = document.getElementById("logoutBtn");
    const form = document.getElementById("statusForm");
    const resultsDiv = document.getElementById("results");
    const mobileInput = document.getElementById("mobileInput");

    /* =========================
       AUTO-FILL MOBILE
    ========================== */

    const storedMobile = localStorage.getItem("citizenMobile");
    if (storedMobile) {
        mobileInput.value = storedMobile;
    }

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
       CHECK STATUS
    ========================== */

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const mobile = mobileInput.value.trim();

        if (!mobile) {
            alert("Please enter mobile number.");
            return;
        }

        resultsDiv.innerHTML = "Checking records...";

        Promise.all([
            fetch("http://127.0.0.1:8000/api/police/complaints/status/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile_number: mobile })
            }).then(res => res.json()),

            fetch("http://127.0.0.1:8000/api/sos/status/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile_number: mobile })
            }).then(res => res.json())
        ])
        .then(([complaintData, sosData]) => {

            resultsDiv.innerHTML = "";

            /* ------------------------
               COMPLAINT SECTION
            ------------------------- */

            if (complaintData.complaints && complaintData.complaints.length > 0) {

                const complaintHeader = document.createElement("h3");
                complaintHeader.innerText = "Filed Complaints";
                resultsDiv.appendChild(complaintHeader);

                complaintData.complaints.forEach(c => {

                    const card = document.createElement("div");
                    card.classList.add("result-card");
                    card.classList.add("status-" + c.status);

                    card.innerHTML = `
                        <strong>Complaint ID:</strong> ${c.id} <br>
                        <strong>Title:</strong> ${c.title} <br>
                        <strong>Status:</strong> ${c.status} <br>
                        <strong>Filed On:</strong> ${c.created_at}
                    `;

                    resultsDiv.appendChild(card);
                });
            }

            /* ------------------------
               SOS SECTION
            ------------------------- */

            if (sosData.sos && sosData.sos.length > 0) {

                const sosHeader = document.createElement("h3");
                sosHeader.innerText = "SOS Alerts";
                sosHeader.style.marginTop = "30px";
                resultsDiv.appendChild(sosHeader);

                sosData.sos.forEach(s => {

                    const card = document.createElement("div");
                    card.classList.add("result-card");

                    card.innerHTML = `
                        <strong>SOS ID:</strong> ${s.id} <br>
                        <strong>Status:</strong> ${s.status} <br>
                        <strong>Triggered On:</strong> ${s.created_at}
                    `;

                    resultsDiv.appendChild(card);
                });
            }

            if (
                (!complaintData.complaints || complaintData.complaints.length === 0) &&
                (!sosData.sos || sosData.sos.length === 0)
            ) {
                resultsDiv.innerHTML =
                    "<p style='color:red;'>No records found.</p>";
            }

        })
        .catch(() => {
            resultsDiv.innerHTML =
                "<p style='color:red;'>Server error.</p>";
        });

    });

});