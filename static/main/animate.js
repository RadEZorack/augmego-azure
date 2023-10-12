import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { scene, objectScene, cssScene, camera, renderer, rendererBackground, threeJSContainer, backgroundCanvas } from '../main/main.js';
import { create3dPage, createCssRenderer, createGlRenderer } from '../main/webpage3d.js';
import { CSS3DObject, CSS3DRenderer } from '../three/CSS3DRenderer.js';
import { selectedObject } from '../main/raycaster.js';
import { sendPlayerPeerData } from '../main/sendPlayerData.js';


const stepDistance = 0.01;

// const cssRenderer = createCssRenderer();
// threeJSContainer.appendChild(cssRenderer.domElement);

// const firstWebPage = create3dPage(1200,1200,0.004, new THREE.Vector3(5,1,5), new THREE.Vector3(0,0,0), "https://courseware.cemc.uwaterloo.ca/", "")

// function createCSS3DObject(s) {
//     // convert the string to dome elements
//     var wrapper = document.createElement('div');
//     wrapper.innerHTML = s;
//     var div = wrapper.firstChild;

//     // set some values on the div to style it, standard CSS
//     div.style.width = '370px';
//     div.style.height = '370px';
//     div.style.opacity = 0.7;
//     div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();

//     // create a CSS3Dobject and return it.
//     var object = new CSS3DObject(div);
//     return object;
// }

// const string =
//       '<iframe src="' +
//       "https://courseware.cemc.uwaterloo.ca/" +
//       '" width="' +
//       "370px" +
//       'px" height="' +
//       "370px" +
//       'px" allow="autoplay">' +
//       "</iframe>";

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);

let cssDiv = document.body.appendChild(cssRenderer.domElement);
let deadZone = document.getElementById("deadZone");

let myPlayerTargetPosition = undefined;


let scale = 0.5;
deadZone.onwheel = onWheel;
function onWheel(event) {
  if( event.deltaY < 0.0){
    scale = 0.5;
  }else{
    scale = -0.5;
  }

  // Apply scale transform
  camera.position.z += scale;
  if (camera.position.z >= 0.5){
    camera.position.z = 0.5;
  }else if (camera.position.z <= -10){
    camera.position.z = -10;
  }

  // camera.lookAt(playerWrapper.position);
  camera.lookAt(new THREE.Vector3(playerWrapper.position.x, playerWrapper.position.y + 2, playerWrapper.position.z));

}

deadZone.onmousedown = onMouseDown;
function onMouseDown(event) {
  let prevScreenPosition = new THREE.Vector2(event.clientX,event.clientY);
  deadZone.onmousemove = function(event) {
  //   cssDiv.onmousedown = undefined;
    // $('iframe').css('pointer-events','none');
      let currentScreenPosition = new THREE.Vector2(event.clientX,event.clientY);
      if(!(prevScreenPosition.x == currentScreenPosition.x)){
          const sensitivityX = 0.01;

          const deltaX = prevScreenPosition.x - currentScreenPosition.x
          cameraController.rotateY(sensitivityX * Math.PI * deltaX);

          // camera.lookAt(playerWrapper.position);
  camera.lookAt(new THREE.Vector3(playerWrapper.position.x, playerWrapper.position.y + 2, playerWrapper.position.z));

      }
      if(!(prevScreenPosition.y == currentScreenPosition.y)){
        const sensitivityY = 0.01;

        const deltaY = prevScreenPosition.y - currentScreenPosition.y;
        cameraRotator.rotateX(- sensitivityY * Math.PI * deltaY);

        // camera.lookAt(playerWrapper.position);
  camera.lookAt(new THREE.Vector3(playerWrapper.position.x, playerWrapper.position.y + 2, playerWrapper.position.z));

    }
      prevScreenPosition = currentScreenPosition;
      deadZone.onmouseup = function(event) {
        deadZone.onmousemove = undefined;
      }
      deadZone.onmouseout = function(event) {
        deadZone.onmousemove = undefined;
      }
  }
}

cssDiv.onmousedown = onMouseDown2;
function onMouseDown2(event) {
  event = singleClick(event);
      event = selectedObject(event);
        myPlayerTargetPosition = event.point;
        myPlayer.scene.lookAt(event.point.x, myPlayer.scene.position.y, event.point.z);
}


// const imageHtml = `
//   <img src="${favicon}" alt="" width="1200" height="1200">
// `
// let cssElement = createCSS3DObject(string);
create3dPage(
    1200,
    1200,
    0.004,
    new THREE.Vector3(3.5, 1.5, 5),
    new THREE.Vector3(0, Math.PI, 0),
    "https://courseware.cemc.uwaterloo.ca/",
    ""
  )


function animate() {
	requestAnimationFrame( animate );
    
    if (!(myPlayerTargetPosition === undefined) && !(playerWrapper === undefined)){
        playerWrapper.position.x += stepDistance * (myPlayerTargetPosition.x - playerWrapper.position.x);
        playerWrapper.position.y += stepDistance * (myPlayerTargetPosition.y - playerWrapper.position.y);
        playerWrapper.position.z += stepDistance * (myPlayerTargetPosition.z - playerWrapper.position.z);

        // cameraController.rotation.x = 0;
        // cameraController.rotation.y = 0;
        // cameraController.rotation.z = 0;
        // cameraController.position.x += stepDistance * (myPlayerTargetPosition.x - myPlayer.scene.position.x);
        // cameraController.position.y += stepDistance * (myPlayerTargetPosition.y - myPlayer.scene.position.y);
        // cameraController.position.z += stepDistance * (myPlayerTargetPosition.z - myPlayer.scene.position.z);
    }

    sendPlayerPeerData();

    // required if controls.enableDamping or controls.autoRotate are set to true
	// controls.update();

    cssRenderer.render(cssScene, camera);

    renderer.setRenderTarget(null);
	renderer.render( scene, camera );

    rendererBackground.setRenderTarget(null);
    rendererBackground.render(objectScene, camera);
}
animate();