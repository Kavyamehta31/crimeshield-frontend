document.addEventListener("DOMContentLoaded", () => {

    const pageContent = document.getElementById("pageContent");

    /* NAVBAR + LOGO ANIMATION */
    document.querySelectorAll(".nav-links a, .logo").forEach(el => {
        el.addEventListener("click", e => {
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

    /* ---------------- OTP LOGIC ---------------- */

    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const otpInput = document.getElementById("citizenOtp");

    const otpPool = [
        "4821", "7394", "6158", "9023", "3476",
        "1849", "5602", "7981", "4217", "9365",
        "2579", "8643", "1907", "5438", "6782",
        "3146", "9058", "7612", "2894", "4370",
        "8526", "1693", "7045", "3982", "6219"
    ];

    let generatedOtp = null;

    sendOtpBtn.addEventListener("click", () => {

        const name = document.getElementById("citizenName").value.trim();
        const mobile = document.getElementById("citizenMobile").value.trim();

        const mobileRegex = /^[6-9]\d{9}$/;

        if (!name) {
            alert("Please enter your full name");
            return;
        }

        if (!mobileRegex.test(mobile)) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        const randomIndex = Math.floor(Math.random() * otpPool.length);
        generatedOtp = otpPool[randomIndex];

        otpInput.value = "";
        otpInput.classList.remove("hidden");
        verifyOtpBtn.classList.remove("hidden");

        alert("Your OTP is: " + generatedOtp);
    });

    verifyOtpBtn.addEventListener("click", () => {

        if (!generatedOtp) {
            alert("Please request OTP first");
            return;
        }

        if (otpInput.value === generatedOtp) {

            // ⭐ GET VALUES AGAIN
            const name = document.getElementById("citizenName").value.trim();
            const mobile = document.getElementById("citizenMobile").value.trim();

            // ⭐ STORE FOR DASHBOARD + BACKEND
            localStorage.setItem("loggedUser", name);
            localStorage.setItem("loggedMobile", mobile);

            generatedOtp = null;

            pageContent.classList.add("page-fade-out");

            setTimeout(() => {
                window.location.href = "citizen_dashboard.html";
            }, 450);

        } else {
            alert("Invalid OTP");
        }
    });

});
