import { textureLoad } from '../main/initTexturePanel.js';

// navigator.getUserMedia(
//  { video: true, audio: false },
//  async stream => {

//     const localVideo = document.getElementById("local-video");
//      localVideo.onloadedmetadata = function(e) {
//         localVideo.play();
//       };
//      if (localVideo) {
//        localVideo.srcObject = stream;
//      }
//  },
//  error => {
//    console.warn(error.message);
//  })

function initSelfCam(){
    let videoCount = 0;
  
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
  
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
  
    navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        devices.forEach(function(device) {
          // console.log(device.kind + ": " + device.label +
                      // " id = " + device.deviceId);
          if(device.kind == "videoinput"){
            console.log("trying")
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
              .then(function(stream) {
                if (videoCount >= 1){
                  return null;
                }
                videoCount += 1;
                const localVideo = document.getElementById("local-video-"+videoCount.toString());
                // console.log(localVideo);
                localVideo.onloadedmetadata = function(e) {
                    localVideo.play();
                };
                if (localVideo) {
                  localVideo.srcObject = stream;
                }

                // textureLoad();
                
              }).catch(function(err) {
                console.log(err.name + ": " + err.message);
              })
          }
        });
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });
  }
  // 
  initSelfCam();