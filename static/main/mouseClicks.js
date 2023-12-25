import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { camera, threeJSContainer } from '../main/main.js';
import { selectedObject } from '../main/raycaster.js';
import { cssRenderer } from '../main/webpage3d.js';
import { quadMeshInstanceIDKeys, gameObjects, redrawObjects } from '../main/redrawObjects.js';
import { drawBlock } from '../main/drawBlock.js';
import { removeBlock } from '../main/removeBlock.js';
import { peerConnections } from '../main/socketConnection.js';



export let myPlayerTargetPosition = new THREE.Vector3(0,0,0);
let cssDiv = threeJSContainer.appendChild(cssRenderer.domElement);
// let deadZone = document.getElementById("deadZone");
// let toggleMouse = document.getElementById("toggleMouse");
// Initial State is WALK
let toggleMouseState = "www";
let blockTextureMaterial = "";
let blockTextureUrl = "";

// Turn on WWW state
$(`img[data-type='www']`).css("border", "solid 2px green");
$('iframe').css('pointer-events', 'auto');
$('.divImage').css('pointer-events', 'auto');

// Turn off WALK state
threeJSContainer.onwheel = onWheel;
threeJSContainer.onmousedown = onMouseDown;

// Prevent the right click menu
threeJSContainer.addEventListener("contextmenu", (event) => { 
  // Question is how to turn back on if needed.
  event.preventDefault();
});

export function initToggleMouseOption(){
  $(".toggleMouseOption").on("click", function(event){
    event.preventDefault();
    event.stopPropagation();
    toggleMouseState = $(this).data("type");
    if (toggleMouseState == "www"){
      // Turn on WWW state
      $(`[data-type='www']`).css("border", "solid 2px green");
      $(`[data-type='create']`).css("border", "solid 2px red");
      $(`[data-type='destroy']`).css("border", "solid 2px red");
      $(`[data-type='walk']`).css("border", "solid 2px red");
      $(`[data-type='rotate']`).css("border", "solid 2px red");
      $(`[data-type='zoom']`).css("border", "solid 2px red");

      $('iframe').css('pointer-events', 'auto');
      $('.divImage').css('pointer-events', 'auto');

      // Turn off WALK state
      threeJSContainer.onwheel = undefined;
      threeJSContainer.onmousedown = undefined;
      threeJSContainer.removeEventListener(
        "touchstart",
        onMouseDown,
        true
      );

    }else if (toggleMouseState == "destroy" || toggleMouseState == "create"){
      if(toggleMouseState == "destroy"){
        blockTextureMaterial = "";
        blockTextureUrl = "";
        $(`[data-type='www']`).css("border", "solid 2px red");
        $(`[data-type='create']`).css("border", "solid 2px red");
        $(`[data-type='destroy']`).css("border", "solid 2px green");
        $(`[data-type='walk']`).css("border", "solid 2px red");
        $(`[data-type='rotate']`).css("border", "solid 2px red");
        $(`[data-type='zoom']`).css("border", "solid 2px red");

      }else if (toggleMouseState == "create"){
        blockTextureMaterial = $(this).data("material");
        blockTextureUrl =  $(this).attr("src");
        $(`[data-type='www']`).css("border", "solid 2px red");
        $(`[data-type='create']`).css("border", "solid 2px red");
        $(this).css("border", "solid 2px green");
        $(`[data-type='destroy']`).css("border", "solid 2px red");
        $(`[data-type='walk']`).css("border", "solid 2px red");
        $(`[data-type='rotate']`).css("border", "solid 2px red");
        $(`[data-type='zoom']`).css("border", "solid 2px red");
      }
      
      // Turn off WWW state
      $('iframe').css('pointer-events', 'none');
      $('.divImage').css('pointer-events', 'none');

      // Turn on WALK state
      threeJSContainer.onwheel = onWheel;
      threeJSContainer.onmousedown = onMouseDown;
      threeJSContainer.addEventListener(
        "touchstart",
        onMouseDown,
        false
      );

    }else if (toggleMouseState == "walk"){
      $(`[data-type='www']`).css("border", "solid 2px red");
      $(`[data-type='create']`).css("border", "solid 2px red");
      $(`[data-type='destroy']`).css("border", "solid 2px red");
      $(`[data-type='walk']`).css("border", "solid 2px green");
      $(`[data-type='rotate']`).css("border", "solid 2px red");
      $(`[data-type='zoom']`).css("border", "solid 2px red");

      // Turn off WWW state
      $('iframe').css('pointer-events', 'none');
      $('.divImage').css('pointer-events', 'none');

      // Turn on WALK state
      threeJSContainer.onwheel = onWheel;
      threeJSContainer.onmousedown = onMouseDown;
      threeJSContainer.addEventListener(
        "touchstart",
        onMouseDown,
        false
      );

    }else if (toggleMouseState == "rotate"){
      $(`[data-type='www']`).css("border", "solid 2px red");
      $(`[data-type='create']`).css("border", "solid 2px red");
      $(`[data-type='destroy']`).css("border", "solid 2px red");
      $(`[data-type='walk']`).css("border", "solid 2px red");
      $(`[data-type='rotate']`).css("border", "solid 2px green");
      $(`[data-type='zoom']`).css("border", "solid 2px red");

      // Turn off WWW state
      $('iframe').css('pointer-events', 'none');
      $('.divImage').css('pointer-events', 'none');

      // Turn on WALK state
      threeJSContainer.onwheel = onWheel;
      threeJSContainer.onmousedown = onMouseDown;
      threeJSContainer.addEventListener(
        "touchstart",
        onMouseDown,
        false
      );

    }else if (toggleMouseState == "zoom"){
      $(`[data-type='www']`).css("border", "solid 2px red");
      $(`[data-type='create']`).css("border", "solid 2px red");
      $(`[data-type='destroy']`).css("border", "solid 2px red");
      $(`[data-type='walk']`).css("border", "solid 2px red");
      $(`[data-type='rotate']`).css("border", "solid 2px red");
      $(`[data-type='zoom']`).css("border", "solid 2px green");

      // Turn off WWW state
      $('iframe').css('pointer-events', 'none');
      $('.divImage').css('pointer-events', 'none');

      // Turn on WALK state
      threeJSContainer.onwheel = onWheel;
      threeJSContainer.onmousedown = onMouseDown;
      threeJSContainer.addEventListener(
        "touchstart",
        onMouseDown,
        false
      );

    }
  })
}

initToggleMouseOption();


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
    if (toggleMouseState == "destroy"){
      onMouseDownDestoryBlock(event);

    }else if (toggleMouseState == "create"){
      onMouseDownCreateBlock(event);

    }else if (toggleMouseState == "walk"){
      onMouseDownPlayerMove(event);
    }

    else if (toggleMouseState == "rotate"){
      onMouseDownMoveScreen(event);
    }

    else if (toggleMouseState == "zoom"){
      onMouseDownZoomScreen(event);
    }

  }else if (event.which == 2) {
    // Middle mouse button rotates screen.
      // onMouseDownMoveScreen(event);

  }else if (event.which == 3) {
    // Right mouse button moves player.
      // onMouseDownPlayerMove(event);
      onMouseDownMoveScreen(event);
  }
}

function onMouseDownMoveScreen(event){
  event.preventDefault();
  if (event.targetTouches && event.targetTouches.length == 1) {
    event = event.targetTouches[0];
  }
  let prevScreenPosition = new THREE.Vector2(event.clientX,event.clientY);
  
  function onMouseMoveMoveScreen(event) {
  //   cssDiv.onmousedown = undefined;
    // $('iframe').css('pointer-events','none');
      event.preventDefault();
      if (event.targetTouches && event.targetTouches.length == 1) {
        event = event.targetTouches[0];
      }
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

  threeJSContainer.onmousemove = onMouseMoveMoveScreen
  threeJSContainer.addEventListener(
    "touchmove",
    onMouseMoveMoveScreen,
    false
  )
}

function onMouseDownZoomScreen(event){
  event.preventDefault();
  if (event.targetTouches && event.targetTouches.length == 1) {
    event = event.targetTouches[0];
  }
  let prevScreenPosition = new THREE.Vector2(event.clientX,event.clientY);
  
  function onMouseMoveZoomScreen(event) {
    event.preventDefault();
    if (event.targetTouches && event.targetTouches.length == 1) {
      event = event.targetTouches[0];
    }
      // event.stopPropagation();
  //   cssDiv.onmousedown = undefined;
    // $('iframe').css('pointer-events','none');
      let currentScreenPosition = new THREE.Vector2(event.clientX,event.clientY);
      
      if(!(prevScreenPosition.y == currentScreenPosition.y)){
        const deltaY = prevScreenPosition.y - currentScreenPosition.y
        if( deltaY < 0.0){
          scale = 0.05;
        }else{
          scale = -0.05;
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

  threeJSContainer.onmousemove = onMouseMoveZoomScreen;
  threeJSContainer.addEventListener(
    "touchmove",
    onMouseMoveZoomScreen,
    false
  )
}

// cssDiv.onmousedown = onMouseDown2;
function onMouseDownPlayerMove(event) {
  if (myPlayer == undefined || event == undefined){
    return null
  }
  event = selectedObject(event);
  myPlayerTargetPosition = event.point;
  myPlayer.scene.lookAt(event.point.x, playerWrapper.position.y, event.point.z);
}

function onMouseDownDestoryBlock(event){
  const data = selectedObject(event);

  if (data != undefined && data.object.uuid != undefined && data.instanceId != undefined){
      const key = quadMeshInstanceIDKeys[data.object.uuid][data.instanceId];
      const keyArray = key.split(":")
      const xyz = keyArray[1].split(",");

      $.ajax({
        url: cubePostURL,
        type: 'POST',
        data: {
          csrfmiddlewaretoken: csrfmiddlewaretoken,
          x: Math.round(xyz[0]),
          y: Math.round(xyz[1]),
          z: Math.round(xyz[2]),
          textureName: ""
        },
        success: function(resp) {
            console.log("success post");
            // console.log(resp);
            const now = new Date();
            for (let uuid in peerConnections){
                let sendChannel = peerConnections[uuid].sendChannel
                if (sendChannel != undefined && sendChannel.readyState == "open"){
                    sendChannel.send(JSON.stringify({
                        'type': 'removeBlock',
                        'name': my_name,
                        'myUuid': myUuid,
                        x: Math.round(xyz[0]),
                        y: Math.round(xyz[1]),
                        z: Math.round(xyz[2]),
                        textureName: "",
                        'time': now.getTime(),
                    }))
                }
              }
        }
      })
      
      removeBlock(xyz[0], xyz[1], xyz[2]);
  }
  redrawObjects();
}

function onMouseDownCreateBlock(event){
  const data = selectedObject(event);
  console.log(data.point)

  $.ajax({
    url: cubePostURL,
    type: 'POST',
    data: {
      csrfmiddlewaretoken: csrfmiddlewaretoken,
      x: Math.round(data.point.x),
      y: Math.round(data.point.y),
      z: Math.round(data.point.z),
      // TODO: replace with a dynamic texture
      textureName: blockTextureMaterial
    },
    success: function(resp) {
        console.log("success post");
        // console.log(resp);
        const now = new Date();
        for (let uuid in peerConnections){
            let sendChannel = peerConnections[uuid].sendChannel
            if (sendChannel != undefined && sendChannel.readyState == "open"){
                sendChannel.send(JSON.stringify({
                    'type': 'drawBlock',
                    'name': my_name,
                    'myUuid': myUuid,
                    x: Math.round(data.point.x),
                    y: Math.round(data.point.y),
                    z: Math.round(data.point.z),
                    textureName: blockTextureUrl,
                    'time': now.getTime(),
                }))
            }
          }
    }
  })
  
  drawBlock(data.point.x, data.point.y, data.point.z, blockTextureUrl);

  redrawObjects();
}