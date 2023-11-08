import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { camera, threeJSContainer } from '../main/main.js';
import { selectedObject } from '../main/raycaster.js';
import { cssRenderer } from '../main/webpage3d.js';
import { triangleMeshInstanceIDKeys, gameObjects, redrawObjects } from '../main/redrawObjects.js';
import { drawBlock } from '../main/drawBlock.js';



export let myPlayerTargetPosition = undefined;
let cssDiv = threeJSContainer.appendChild(cssRenderer.domElement);
// let deadZone = document.getElementById("deadZone");
let toggleMouse = document.getElementById("toggleMouse");
// Initial State is WALK
let toggleMouseState = "walk";

// Turn off WWW state
$('iframe').css('pointer-events', 'none');

// Turn on WALK state
threeJSContainer.onwheel = onWheel;
threeJSContainer.onmousedown = onMouseDown;
threeJSContainer.addEventListener("contextmenu", (event) => {
  // Prevent the right click menu
  // Question is how to turn back on if needed.
  event.preventDefault();
});

toggleMouse.onmousedown = function(event){
  event.preventDefault();
  event.stopPropagation();
    if (toggleMouseState == "walk"){
        // WWWW
        toggleMouseState = "www";
        // toggleMouse.innerHTML = '<img src="'+wwwWebp+'" alt="Walk" width="100%" height="100%">';
        toggleMouse.innerHTML = '<img style="position: absolute;" src="'+atSymbolPng+'" alt="Walk" width="100%" height="100%"><span style="position: absolute; color: white; text-shadow: 2px 2px #000000;">Click me to change between movement and interacting with web pages.</span>';

        // Turn on WWW state
        $('iframe').css('pointer-events', 'auto');
        $('.divImage').css('pointer-events', 'auto');
        // Turn off WALK state
        threeJSContainer.onwheel = undefined;
        threeJSContainer.onmousedown = undefined;

    }else if (toggleMouseState == "www"){
        // CREATE
        toggleMouseState = "create";
        toggleMouse.innerHTML = '<img src="'+favicon+'" alt="Walk" width="100%" height="100%">';

        // Turn off WWW state
        // $('.css3ddiv').css('pointer-events', 'none');
        $('iframe').css('pointer-events', 'none');
        $('.divImage').css('pointer-events', 'none');
        threeJSContainer.onmousedown = onCreateMouseDown;

    }else if (toggleMouseState == "create"){
        // WALK
        toggleMouseState = "walk";
        // toggleMouse.innerHTML = '<img src="'+walkJpg+'" alt="Walk" width="100%" height="100%">';
        toggleMouse.innerHTML = '<img style="position: absolute;" src="'+walkPng+'" alt="Walk" width="100%" height="100%"><span style="position: absolute; color: white; text-shadow: 2px 2px #000000;">Click me to change between movement and interacting with web pages.</span>';


        // Turn off WWW state
        $('iframe').css('pointer-events', 'none');
        $('.divImage').css('pointer-events', 'none');

        // Turn on WALK state
        threeJSContainer.onwheel = onWheel;
        threeJSContainer.onmousedown = onMouseDown;
    }
}



let scale = 0.5;
// deadZone.onwheel = onWheel;
function onWheel(event) {
    event.preventDefault();
    event.stopPropagation();
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

// deadZone.onmousedown = onMouseDown;
function onMouseDown(event) {
  event = singleClick(event);
  if (event.which == 1) {
      onMouseDownLeft(event);
    // case 2:
    //     alert('Middle Mouse button pressed.');
    //     break;
  }else if (event.which == 3) {
      onMouseDownRight(event);
  }
}

function onMouseDownRight(event){
  
  let prevScreenPosition = new THREE.Vector2(event.clientX,event.clientY);
  threeJSContainer.onmousemove = function(event) {
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
      
      threeJSContainer.onmouseup = function(event) {
        // Finished!
        threeJSContainer.onmousemove = undefined;
      }

      threeJSContainer.onmouseleave = function(event) {
        // Stop the mouse from depring out when leaving the web page.
        threeJSContainer.onmousemove = undefined;
      }
  }
}

// cssDiv.onmousedown = onMouseDown2;
function onMouseDownLeft(event) {
  if (myPlayer == undefined || event == undefined){
    return null
  }
  event = selectedObject(event);
  myPlayerTargetPosition = event.point;
  myPlayer.scene.lookAt(event.point.x, playerWrapper.position.y, event.point.z);
}


function onCreateMouseDown(event) {
  event = singleClick(event);
  if (event.which == 1) {
    onCreateMouseDownLeft(event);
    // case 2:
    //     alert('Middle Mouse button pressed.');
    //     break;
  }else if (event.which == 3) {
    onCreateMouseDownRight(event);
  }
}

function onCreateMouseDownLeft(event){
  const data = selectedObject(event);

  // if (data != undefined && data.object.uuid != undefined && data.instanceId != undefined){
  //   const index = triangleMeshInstanceIDKeys[data.object.uuid][data.instanceId];
  //   // TODO Fix
  //   gameObjects.splice(index, 1);

  //   redrawObjects();
  // }
}

function onCreateMouseDownRight(event){
  const data = selectedObject(event);

  console.log(data);

  drawBlock(data.point.x, data.point.y, data.point.z, grassTexture);

  redrawObjects();
}