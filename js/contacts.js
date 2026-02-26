/* GLOBAL NAVIGATION + LOGIN BUTTON ANIMATION – CONTACTS PAGE */
document.addEventListener("DOMContentLoaded", function () {

    const pageContent = document.getElementById("pageContent");

    const clickableElements = document.querySelectorAll(
        ".nav-links a, .logo, .login-btn"
    );

    clickableElements.forEach(element => {
        element.addEventListener("click", function (e) {

            let targetUrl;

            if (this.classList.contains("login-btn")) {
                targetUrl = this.getAttribute("data-link");
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
