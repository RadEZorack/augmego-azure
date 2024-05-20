document.addEventListener("DOMContentLoaded", function() {
    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
    
          // First get ahold of the legacy getUserMedia, if present
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    
          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }
    
          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        }
      }
      
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
