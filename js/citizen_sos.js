// SHOW USERNAME
document.addEventListener("DOMContentLoaded", function () {
    const name = localStorage.getItem("loggedUser");
    const display = document.getElementById("usernameDisplay");

    if (name && display) {
        display.textContent = name;
    }
});


// NAVIGATION + LOGOUT
document.addEventListener("DOMContentLoaded", function () {

    const pageContent = document.getElementById("pageContent");

    const navTargets = document.querySelectorAll(
        ".logo, #logoutBtn"
    );

    navTargets.forEach(target => {
        target.addEventListener("click", function (e) {

            let targetUrl;

            if (this.id === "logoutBtn") {
                localStorage.removeItem("loggedUser");
                targetUrl = "index.html";
            } else {
                targetUrl = "citizen_dashboard.html";
            }

            e.preventDefault();

            if (pageContent) {
                pageContent.classList.add("page-fade-out");
            }

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 450);
        });
    });
});
