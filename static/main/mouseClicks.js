import * as THREE from '../three/three.module.min.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { camera, threeJSContainer } from '../main/main.js';
import { selectedObject } from '../main/raycaster.js';
import { cssRenderer } from '../main/webpage3d.js';
import { quadMeshInstanceIDKeys, gameObjects, redrawObjects } from '../main/redrawObjects.js';
import { drawBlock } from '../main/drawBlock.js';
import { removeBlock } from '../main/removeBlock.js';
import { peerConnections } from '../main/socketConnection.js';
import { isFirstPerson } from '../main/commands.js';
// import { familyName } from '../main/family.js';

const familyName = 'Lobby'


export let myPlayerTargetPosition = new THREE.Vector3(0,0,0);
let cssDiv = threeJSContainer.appendChild(cssRenderer.domElement);
// let deadZone = document.getElementById("deadZone");
// let toggleMouse = document.getElementById("toggleMouse");
// Initial State is DESTROY
export let toggleMouseState = "destroy";
export var blockTextureMaterial = "";
let blockTextureUrl = "";

// Turn on WWW state
$(`img[data-type='destroy']`).css("border", "solid 2px green");
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

export function initToggleMouseOption(textureAtlasURL, textureAtlasMapping){
  const middleItemBackground = document.getElementById('middleItemBackground');
  $(".toggleMouseOption").on("click", function(event){
    event.preventDefault();
    event.stopPropagation();
    toggleMouseState = $(this).data("type");

    if(toggleMouseState == "destroy"){
      blockTextureMaterial = "";
      blockTextureUrl = "";
      // $(`[data-type='create']`).css("border", "solid 2px red");
      $('#selectedMaterial').css("border", "solid 2px red");
      $(`[data-type='destroy']`).css("border", "solid 2px green");
      middleItemBackground.innerHTML = `<img id="middleItemBackgroundImg" src="${destoryBlockPng}" width="100%" height="100%">`

    // }else if (toggleMouseState == "create"){
    //   console.log(event)
    //   // blockTextureMaterial = $(this).data("material");
    //   // blockTextureUrl =  $(this).attr("src");
    //   // $("#middleItemBackgroundImg").attr("src", blockTextureUrl)
    //   // $(`[data-type='create']`).css("border", "solid 2px red");
    //   // $(this).css("border", "solid 2px green");
    //   $(`[data-type='destroy']`).css("border", "solid 2px red");
    }
  })

  const textureSize = 64; // Assuming each texture is 64x64 pixels
  const texturesCount = Object.keys(textureAtlasMapping).length;

  // Calculate the number of columns and rows needed
  const atlasColumns = Math.ceil(Math.sqrt(texturesCount));
  const atlasRows = Math.ceil(texturesCount / atlasColumns);

  // Calculate the dimensions of the atlas
  const atlasWidth = atlasColumns * textureSize;
  const atlasHeight = atlasRows * textureSize;

  const container = document.getElementById('texturePanel');
  container.innerHTML = `<canvas id="textureAtlas" width="${atlasWidth}px" height="${atlasHeight}px" data-type="create"></canvas>`

  
  
  
  const image = new Image();
  image.src = textureAtlasURL

  image.onload = function() {
      const canvas = document.getElementById('textureAtlas');
      const ctx = canvas.getContext('2d');
      

      // Draw the image onto the canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Add a click event listener to the canvas
      canvas.addEventListener('click', function(event) {
        // Get the click coordinates
        const rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        x = Math.floor(x / 64) * 64;
        y = Math.floor(y / 64) * 64;
          
          Object.values(textureAtlasMapping).forEach((data, i) => {
              if(data.x == x && data.y == y){
                  blockTextureMaterial = data.name;
              }
          
          });
          console.log(blockTextureMaterial)

        if (blockTextureMaterial){
          middleItemBackground.innerHTML = `<canvas id="middleItemBackgroundCanvas" width="100%" height="100%" data-type="create"></canvas>`
          const middleItemBackgroundCanvas = document.getElementById('middleItemBackgroundCanvas');
          const middleItemBackgroundCtx = middleItemBackgroundCanvas.getContext('2d');

          // Clear the highlight canvas
          middleItemBackgroundCtx.clearRect(0, 0, middleItemBackgroundCanvas.width, middleItemBackgroundCanvas.height);

          // Draw the 64x64 area on the highlight canvas
          middleItemBackgroundCtx.drawImage(canvas, x, y, 64, 64, 0, 0, middleItemBackgroundCanvas.width, middleItemBackgroundCanvas.height);

          const selectedMaterial = document.getElementById('selectedMaterial');
          selectedMaterial.style.border = "solid 2px green";

          selectedMaterial.innerHTML = `<canvas id="selectedMaterialCanvas" width="64px" height="64px" data-type="create"></canvas>`
          const selectedMaterialCanvas = document.getElementById('selectedMaterialCanvas');
          const selectedMaterialCtx = selectedMaterialCanvas.getContext('2d');

          // Clear the highlight canvas
          selectedMaterialCtx.clearRect(0, 0, selectedMaterialCanvas.width, selectedMaterialCanvas.height);

          // Draw the 64x64 area on the highlight canvas
          selectedMaterialCtx.drawImage(canvas, x, y, 64, 64, 0, 0, selectedMaterialCanvas.width, selectedMaterialCanvas.height);

          toggleMouseState = "create"
          $(`[data-type='destroy']`).css("border", "solid 2px red");
        }
      });
  }



  return;
  // We do not allow click placement anymore.

  $(".toggleMouseOption").on("click", function(event){
    event.preventDefault();
    event.stopPropagation();
    toggleMouseState = $(this).data("type");
    if (toggleMouseState == "buy"){
      // Show property info/lines
    }else{
      // Remove property info/lines
    }
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

// initToggleMouseOption();


let scale = 0.5;
// deadZone.onwheel = onWheel;
function onWheel(event) {
  if(isFirstPerson){
    return null
  }
    event.preventDefault();
    event.stopPropagation();
  if( event.deltaY < 0.0){
    scale = 0.5;
  }else{
    scale = -0.5;
  }

  // Apply scale transform
  camera.position.z += scale;
  if (camera.position.z >= -0.5){
    camera.position.z = -0.5;
  }else if (camera.position.z <= -10){
    camera.position.z = -10;
  }

  // camera.lookAt(playerWrapper.position);
  camera.lookAt(new THREE.Vector3(playerWrapper.position.x, camera.position.y, playerWrapper.position.z));

}

// deadZone.onmousedown = onMouseDown;
function onMouseDown(event) {
  return null;
  // We no longer allow click placement

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
      // onMouseDownMoveScreen(event);
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

export function onMouseDownDestoryBlock(data){
  // const data = selectedObject(event);  

  if (data != undefined && data.object.uuid != undefined && data.instanceId != undefined){
      const xyz = quadMeshInstanceIDKeys[data.instanceId];
      // const keyArray = key.split(":")
      // const xyz = keyArray[1].split(",");

      const distance = Math.sqrt(
        Math.pow(xyz[0] - playerWrapper.position.x, 2) +
        Math.pow(xyz[1] - playerWrapper.position.y, 2) +
        Math.pow(xyz[2] - playerWrapper.position.z, 2)
      )
      console.log(distance)
    
      if (distance > 5.0){
        return;
      }

      $.ajax({
        url: cubePostURL,
        type: 'POST',
        data: {
          csrfmiddlewaretoken: csrfmiddlewaretoken,
          x: Math.round(xyz[0]),
          y: Math.round(xyz[1]),
          z: Math.round(xyz[2]),
          familyName: familyName,
          textureName: ""
        },
        success: function(resp) {
            console.log("success post rmove");
            // Placing this here may be slower than expected, can we put outside of the ajax request and then undo it on error.
            removeBlock(xyz[0], xyz[1], xyz[2]);
            redrawObjects();
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
      
      
  }
  
}

export function onMouseDownCreateBlock(data){
  // const data = selectedObject(event);
  console.log(data.point)

  const distance = Math.sqrt(
    Math.pow(data.point.x - playerWrapper.position.x, 2) +
    Math.pow(data.point.y - playerWrapper.position.y, 2) +
    Math.pow(data.point.z - playerWrapper.position.z, 2)
  )
  console.log(distance)

  if (distance > 5.0){
    return;
  }

  // This is now handled buy a command button
  // if (blockTextureMaterial == "Buy Sign"){
  //   $.ajax({
  //     url: chunkPurchaseURL,
  //     type: 'POST',
  //     data: {
  //       csrfmiddlewaretoken: csrfmiddlewaretoken,
  //       x: Math.floor(data.point.x/10),
  //       y: Math.floor(data.point.y/10),
  //       z: Math.floor(data.point.z/10)
  //     },
  //     success: function(resp) {
  //       console.log("success buy");
  //     }
  //   })
  //   // Short circuit
  //   return
  // }

  $.ajax({
    url: cubePostURL,
    type: 'POST',
    data: {
      csrfmiddlewaretoken: csrfmiddlewaretoken,
      x: Math.round(data.point.x),
      y: Math.round(data.point.y),
      z: Math.round(data.point.z),
      familyName: familyName,
      // TODO: replace with a dynamic texture
      textureName: blockTextureMaterial
    },
    success: function(resp) {
        console.log("success post");
        // Placing this here may be slower than expected, can we put outside of the ajax request and then undo it on error.
        drawBlock(data.point.x, data.point.y, data.point.z, blockTextureMaterial);
        redrawObjects();

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
                    textureName: blockTextureMaterial,
                    'time': now.getTime(),
                }))
            }
          }
    }
  })
  
  
}