/* =========================================
   NAVIGATION ANIMATION
========================================= */
document.addEventListener("DOMContentLoaded", function () {

    const pageContent = document.getElementById("pageContent");
    const clickableElements = document.querySelectorAll(
        ".nav-links a, .logo, .login-btn"
    );

    clickableElements.forEach(el => {
        el.addEventListener("click", function (e) {
            const targetUrl =
                this.dataset.link ||
                this.getAttribute("href") ||
                "index.html";

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


/* =========================================
   CAMERA + SOS LOGIC
========================================= */
const statusText = document.getElementById("status");
const video = document.getElementById("video");
const stopBtn = document.querySelector(".stop-btn");

let mediaRecorder = null;
let recordedChunks = [];
let sosId = null;   // ⭐ IMPORTANT


/* START CAMERA + RECORDING */
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        video.srcObject = stream;

        recordedChunks = [];

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };

        mediaRecorder.start();
        statusText.innerText = "Recording started. Sending SOS...";

        /* GET USER DETAILS FROM STORAGE */
        const citizenName = localStorage.getItem("loggedUser");
        const citizenMobile = localStorage.getItem("loggedMobile");

        /* SEND LOCATION + USER TO BACKEND */
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    fetch("http://127.0.0.1:8000/api/sos/start/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            citizen_name: citizenName,
                            citizen_mobile: citizenMobile
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        sosId = data.sos_id;
                        console.log("SOS created:", sosId);
                        statusText.innerText =
                            "SOS sent. Video recording in progress.";
                    })
                    .catch(() => {
                        statusText.innerText =
                            "Error contacting emergency services.";
                    });
                },
                () => {
                    statusText.innerText = "Location permission denied.";
                }
            );
        }
    })
    .catch(() => {
        statusText.innerText = "Camera or microphone permission denied.";
    });


/* STOP RECORDING + UPLOAD */
if (stopBtn) {
    stopBtn.addEventListener("click", () => {

        if (!mediaRecorder || mediaRecorder.state === "inactive") {
            return;
        }

        mediaRecorder.stop();

        mediaRecorder.onstop = () => {

            const videoBlob = new Blob(recordedChunks, {
                type: "video/webm"
            });

            statusText.innerText =
                "Recording stopped. Uploading evidence...";

            const formData = new FormData();
            formData.append("video", videoBlob);
            formData.append("sos_id", sosId);

            fetch("http://127.0.0.1:8000/api/sos/upload-video/", {
                method: "POST",
                body: formData
            })
            .then(() => {
                statusText.innerText =
                    "Video uploaded successfully. Help is on the way.";
            })
            .catch(() => {
                statusText.innerText =
                    "Video upload failed.";
            });
        };
    });
}
