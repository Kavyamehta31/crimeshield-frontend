/* GLOBAL NAVIGATION + LOGIN BUTTON ANIMATION – CITIZEN LAWS PAGE */
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
