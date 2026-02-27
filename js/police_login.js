console.log("Police login JS loaded");
const btn = document.getElementById("policeLoginBtn");

btn.addEventListener("click", async () => {

    console.log("Login button clicked");

    const username = document.getElementById("policeUsername").value;
    const password = document.getElementById("policePassword").value;

    try {
        const response = await fetch("https://crimeshield-backend.onrender.com/api/police/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        console.log("Response status:", response.status);

        const data = await response.json();

        console.log("Response data:", data);

        if (response.ok) {
            alert("Login successful");
            window.location.href = "police_dashboard.html";
        } else {
            alert(data.error || "Login failed");
        }

    } catch (err) {
        console.error("Fetch error:", err);
    }
});


