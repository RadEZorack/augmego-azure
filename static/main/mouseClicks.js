import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { camera, threeJSContainer } from '../main/main.js';
import { selectedObject } from '../main/raycaster.js';
import { cssRenderer } from '../main/webpage3d.js';
import { triangleMeshInstanceIDKeys, gameObjects, redrawObjects } from '../main/redrawObjects.js';



export let myPlayerTargetPosition = undefined;
let cssDiv = threeJSContainer.appendChild(cssRenderer.domElement);
// let deadZone = document.getElementById("deadZone");
let toggleMouse = document.getElementById("toggleMouse");
// Initial State is WWW... because turning off pointer events before loading doesn't work very well.
let toggleMouseState = "www";

// Turn on WWW state
threeJSContainer.onwheel = undefined;
threeJSContainer.onmousedown = undefined;
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
        toggleMouse.innerHTML = '<img src="'+wwwWebp+'" alt="Walk" width="100%" height="100%">';

        // Turn on WWW state
        $('.css3ddiv').css('pointer-events', 'auto');
        // Turn off WALK state
        threeJSContainer.onwheel = undefined;
        threeJSContainer.onmousedown = undefined;

    // }else if (toggleMouseState == "www"){
    //     // CREATE
    //     toggleMouseState = "create";
    //     toggleMouse.innerHTML = '<img src="'+blockWebp+'" alt="Walk" width="100%" height="100%">';

    //     // Turn off WWW state
    //     $('.css3ddiv').css('pointer-events', 'none');
    //     threeJSContainer.onmousedown = onCreateMouseDown;

    }else if (toggleMouseState == "www"){
        // WALK
        toggleMouseState = "walk";
        toggleMouse.innerHTML = '<img src="'+walkJpg+'" alt="Walk" width="100%" height="100%">';

        // Turn off WWW state
        $('.css3ddiv').css('pointer-events', 'none');

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
        threeJSContainer.onmousemove = undefined;
      }
      threeJSContainer.onmouseout = function(event) {
        threeJSContainer.onmousemove = undefined;
      }
  }
}

// cssDiv.onmousedown = onMouseDown2;
function onMouseDownLeft(event) {
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

  if (data != undefined && data.object.uuid != undefined && data.instanceId != undefined){
    const index = triangleMeshInstanceIDKeys[data.object.uuid][data.instanceId];
    gameObjects.splice(index, 1);

    redrawObjects();
  }
}

function onCreateMouseDownRight(event){
  const data = selectedObject(event);

  const x = Math.floor(data.point.x);
  const y = Math.floor(data.point.y);
  const z = Math.floor(data.point.z);

  gameObjects.push({
    key: `block:${x},${y},${z}:0:bottom:0`,
    textureUrl: favicon,
    p1x: x,
    p1y: y,
    p1z: z,

    p2x: x,
    p2y: y,
    p2z: z+1,

    p3x: x+1,
    p3y: y,
    p3z: z,

    uv1x: 0.0,
    uv1y: 0.0,

    uv2x: 0.0,
    uv2y: 1.0,

    uv3x: 1.0,
    uv3y: 0.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:bottom:1`,
    textureUrl: favicon,
    p1x: x,
    p1y: y,
    p1z: z+1,

    p2x: x+1,
    p2y: y,
    p2z: z+1,

    p3x: x+1,
    p3y: y,
    p3z: z,

    uv1x: 0.0,
    uv1y: 1.0,

    uv2x: 1.0,
    uv2y: 1.0,

    uv3x: 1.0,
    uv3y: 0.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:top:0`,
    textureUrl: favicon,
    p1x: x,
    p1y: y+1,
    p1z: z,

    p2x: x+1,
    p2y: y+1,
    p2z: z,

    p3x: x,
    p3y: y+1,
    p3z: z+1,

    uv1x: 0.0,
    uv1y: 0.0,

    uv2x: 1.0,
    uv2y: 0.0,

    uv3x: 0.0,
    uv3y: 1.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:top:1`,
    textureUrl: favicon,
    p1x: x+1,
    p1y: y+1,
    p1z: z,

    p2x: x+1,
    p2y: y+1,
    p2z: z+1,

    p3x: x,
    p3y: y+1,
    p3z: z+1,

    uv1x: 1.0,
    uv1y: 0.0,

    uv2x: 1.0,
    uv2y: 1.0,

    uv3x: 0.0,
    uv3y: 1.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:south:0`,
    textureUrl: favicon,
    p1x: x,
    p1y: y,
    p1z: z,

    p2x: x+1,
    p2y: y,
    p2z: z,

    p3x: x,
    p3y: y+1,
    p3z: z,

    uv1x: 0.0,
    uv1y: 0.0,

    uv2x: 1.0,
    uv2y: 0.0,

    uv3x: 0.0,
    uv3y: 1.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:south:1`,
    textureUrl: favicon,
    p1x: x+1,
    p1y: y,
    p1z: z,

    p2x: x+1,
    p2y: y+1,
    p2z: z,

    p3x: x,
    p3y: y+1,
    p3z: z,

    uv1x: 1.0,
    uv1y: 0.0,

    uv2x: 1.0,
    uv2y: 1.0,

    uv3x: 0.0,
    uv3y: 1.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:north:0`,
    textureUrl: favicon,
    p1x: x+1,
    p1y: y,
    p1z: z+1,

    p2x: x,
    p2y: y,
    p2z: z+1,

    p3x: x,
    p3y: y+1,
    p3z: z+1,

    uv1x: 1.0,
    uv1y: 0.0,

    uv2x: 0.0,
    uv2y: 0.0,

    uv3x: 0.0,
    uv3y: 1.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:north:1`,
    textureUrl: favicon,
    p1x: x+1,
    p1y: y+1,
    p1z: z+1,

    p2x: x+1,
    p2y: y,
    p2z: z+1,

    p3x: x,
    p3y: y+1,
    p3z: z+1,

    uv1x: 1.0,
    uv1y: 1.0,

    uv2x: 1.0,
    uv2y: 0.0,

    uv3x: 0.0,
    uv3y: 1.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:east:0`,
    textureUrl: favicon,
    p1x: x,
    p1y: y,
    p1z: z,

    p2x: x,
    p2y: y+1,
    p2z: z,

    p3x: x,
    p3y: y,
    p3z: z+1,

    uv1x: 0.0,
    uv1y: 0.0,

    uv2x: 0.0,
    uv2y: 1.0,

    uv3x: 1.0,
    uv3y: 0.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:east:1`,
    textureUrl: favicon,
    p1x: x,
    p1y: y+1,
    p1z: z+1,

    p2x: x,
    p2y: y,
    p2z: z+1,

    p3x: x,
    p3y: y+1,
    p3z: z,

    uv1x: 1.0,
    uv1y: 1.0,

    uv2x: 1.0,
    uv2y: 0.0,

    uv3x: 0.0,
    uv3y: 1.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:west:0`,
    textureUrl: favicon,
    p1x: x+1,
    p1y: y,
    p1z: z,

    p2x: x+1,
    p2y: y,
    p2z: z+1,

    p3x: x+1,
    p3y: y+1,
    p3z: z,

    uv1x: 0.0,
    uv1y: 0.0,

    uv2x: 1.0,
    uv2y: 0.0,

    uv3x: 0.0,
    uv3y: 1.0,
    weightChance: Math.random(),
  });

  gameObjects.push({
    key: `block:${x},${y},${z}:0:west:1`,
    textureUrl: favicon,
    p1x: x+1,
    p1y: y+1,
    p1z: z+1,

    p2x: x+1,
    p2y: y+1,
    p2z: z,

    p3x: x+1,
    p3y: y,
    p3z: z+1,

    uv1x: 1.0,
    uv1y: 1.0,

    uv2x: 0.0,
    uv2y: 1.0,

    uv3x: 1.0,
    uv3y: 0.0,
    weightChance: Math.random(),
  });

  redrawObjects();
}