document.addEventListener("DOMContentLoaded", () => {

    const pageContent = document.getElementById("pageContent");

    /* ROLE CARD + LOGO ANIMATION */
    document.querySelectorAll("[data-link]").forEach(el => {
        el.addEventListener("click", e => {
            const target = el.getAttribute("data-link");
            if (!target) return;

            e.preventDefault();
            pageContent.classList.add("page-fade-out");

            setTimeout(() => {
                window.location.href = target;
            }, 450);
        });
    });

    /* NAVBAR LINK ANIMATION */
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", e => {
            const target = link.getAttribute("href");
            if (!target) return;

            e.preventDefault();
            pageContent.classList.add("page-fade-out");

            setTimeout(() => {
                window.location.href = target;
            }, 450);
        });
    });

});
