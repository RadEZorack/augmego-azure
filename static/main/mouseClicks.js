import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { camera, threeJSContainer } from '../main/main.js';
import { CSS3DRenderer } from '../three/CSS3DRenderer.js';
import { selectedObject } from '../main/raycaster.js';

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);

let cssDiv = threeJSContainer.appendChild(cssRenderer.domElement);
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
  camera.lookAt(new THREE.Vector3(playerWrapper.position.x, camera.position.y, playerWrapper.position.z));

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
  camera.lookAt(new THREE.Vector3(playerWrapper.position.x, camera.position.y, playerWrapper.position.z));

      }
      if(!(prevScreenPosition.y == currentScreenPosition.y)){
        const sensitivityY = 0.01;

        const deltaY = prevScreenPosition.y - currentScreenPosition.y;
        cameraRotator.rotateX(- sensitivityY * Math.PI * deltaY);

        // camera.lookAt(playerWrapper.position);
  camera.lookAt(new THREE.Vector3(playerWrapper.position.x, camera.position.y, playerWrapper.position.z));

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