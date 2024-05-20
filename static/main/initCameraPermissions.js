document.addEventListener("DOMContentLoaded", function() {
    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request camera and microphone access
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function(stream) {
            // Permissions granted
            console.log("Permissions granted");

            // Stop all tracks to release the camera and microphone
            stream.getTracks().forEach(track => track.stop());
        })
        .catch(function(err) {
            // Permissions denied
            console.error("Permissions denied", err);
        });
    } else {
        console.error("getUserMedia not supported in this browser.");
    }
});
