const btn = document.getElementById("policeLoginBtn");

btn.addEventListener("click", async () => {

    const username = document.getElementById("policeUsername").value.trim();
    const password = document.getElementById("policePassword").value.trim();

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    try {
        const response = await fetch("https://crimeshield-backend.onrender.com/api/police/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {

            // 🔐 STORE TOKEN
            localStorage.setItem("policeToken", data.token);

            // 👮 STORE USERNAME
            localStorage.setItem("policeUsername", data.username);

            alert("Login successful");

            window.location.href = "police_dashboard.html";

        } else {
            alert(data.error || "Login failed");
        }

    } catch (err) {
        console.error(err);
        alert("Server error. Is Django running?");
    }
});