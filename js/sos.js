/* SOS BUTTON WITH ANIMATION */
function handleSOS() {
    const pageContent = document.getElementById("pageContent");

    if (pageContent) {
        pageContent.classList.add("page-fade-out");
    }

    setTimeout(() => {
        alert("SOS Alert Sent! Authorities have been notified.");
        window.location.href = "camera.html";
    }, 450);
}

/* GLOBAL NAVIGATION + LOGIN BUTTON ANIMATION */
document.addEventListener("DOMContentLoaded", function () {

    const pageContent = document.getElementById("pageContent");

    const navTargets = document.querySelectorAll(
        ".nav-links a, .logo, .login-btn"
    );

    navTargets.forEach(target => {
        target.addEventListener("click", function (e) {

            let targetUrl;

            if (this.classList.contains("login-btn")) {
                targetUrl = "login_page.html";
            } else if (this.tagName === "A") {
                targetUrl = this.getAttribute("href");
            } else {
                targetUrl = "index.html";
            }

            if (!targetUrl) return;

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
