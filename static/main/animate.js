import * as THREE from '../three/three.module.min.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { scene, objectScene, cssScene, camera, allCameras, activeCameraName, renderer, rendererBackground, rendererMap, threeJSContainer, backgroundCanvas, positionMap } from '../main/main.js';
import { create3dPage, cssRenderer } from '../main/webpage3d.js';
import { CSS3DObject, CSS3DRenderer } from '../three/CSS3DRenderer.js';
import { myPlayerTargetPosition } from '../main/mouseClicks.js';
import { sendPlayerPeerData } from '../main/sendPlayerData.js';
import { gameObjects, startRedrawObjectsSpinner } from '../main/redrawObjects.js';
import { entities } from '../main/entity.js';
import { finalQuaternion, rightJoystickXPercent, rightJoystickYPercent, leftJoystickYPercent, leftJoystickXPercent, rotationDegrees, frontToBack_degrees, leftToRight_degrees } from '../main/controls.js';
import { qDown, wDown, eDown, aDown, sDown, dDown, spaceDown } from '../main/QWEASD.js'
import { isWalk } from '../main/commands.js'

export let playerAnimation = 'idle';

const stepDistance = 0.01;



// redrawObjects();

const clock = new THREE.Clock()
let moveDownXHR = undefined;
let lastTime = 0;
const euler = new THREE.Euler(0, 0, 0, "YXZ");
let savedEuler = new THREE.Euler(0, 0, 0, "YXZ");
const PI_2 = Math.PI / 2;
let stopSpinner = false;

let timeSinceStop = 0;

function animate() {
    // if (stopAnimate == true){
    //     // We need the player to interact with the page before things will work correctly.
    //     // So we loop until we get the flag to start, which can be found on the main page.
    //     const stopAnimateXHR = setTimeout(function(){
    //         animate()
    //     }, 1000)
    //     return null
    // }
	requestAnimationFrame( animate );

    const clockDelta = clock.getDelta()

    timeSinceStop += clockDelta;
    
    if (!(playerWrapper === undefined)){
        if (startRedrawObjectsSpinner == true){
            $("#loadingSpinner").show()
        }
        // Stop the spinner
        if (stopSpinner == false){
            stopSpinner = true;
            $("#loadingSpinner").hide()
        }
        const time = performance.now();

        const delta = time - lastTime;

        // window.sun.position.y -= 0.001*delta;

        lastTime =  time;

        let deltaZ = 0;
        let deltaX = 0;
        // let deltaY = 0;
        // let deltaK = 0;

        // savedEuler.setFromQuaternion(playerWrapper.quaternion);
        euler.setFromQuaternion(finalQuaternion);


        // if (rotationDegrees == undefined){
        //     euler.y -= 0.0002 * delta * (Math.round(2*rightJoystickXPercent) * PI_2);
        //     if (isWalk){
        //         if(aDown){
        //             euler.y += 0.0004 * delta * PI_2;
        //         }
        //         if(dDown){
        //             euler.y -= 0.0004 * delta * PI_2;
        //         }
        //     }
        // }else{
        //   euler.y = rotationDegrees * Math.PI / 22.5; // TODO: This fraction should be made into a user option.
        
          savedEuler.y -= 0.0002 * delta * (Math.round(2*rightJoystickXPercent) * PI_2);
          if (isWalk){
              if(aDown){
                savedEuler.y += 0.0004 * delta * PI_2;
              }
              if(dDown){
                savedEuler.y -= 0.0004 * delta * PI_2;
              }
          }

          euler.y += savedEuler.y;
        // }
        



        // if (rotationDegrees == undefined){
        //     euler.x -= 0.0002 * delta * (Math.round(2*rightJoystickYPercent) * PI_2);

        //     euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
        // }else{
            savedEuler.x -= 0.0002 * delta * (Math.round(2*rightJoystickYPercent) * PI_2);
            // savedEuler.x = Math.max(-PI_2, Math.min(PI_2, savedEuler.x));

            // if(leftToRight_degrees != undefined){
            //     if(leftToRight_degrees <= 0.0){
            //         euler.x = (leftToRight_degrees + 90.0 - 22.5)* Math.PI / 90.0; // TODO: This fraction should be made into a user option.
            //     }else{
            //         euler.x = (leftToRight_degrees - 90.0 - 22.5)* Math.PI / 90.0; // TODO: This fraction should be made into a user option.
            //     }
            // }
            euler.x += savedEuler.x;
            // euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
        // }

        // We want the player to stand up right all the time, so we need both of these.
        cameraController.quaternion.setFromEuler(new THREE.Euler(euler.x, 0, euler.z, "YXZ"));
        playerWrapper.quaternion.setFromEuler(new THREE.Euler(0, euler.y, 0, "YXZ"));
        // playerWrapper.quaternion.copy(finalQuaternion);

        // Forward and backward
        deltaZ +=
            0.001 *
            delta *
            (Math.cos(euler.y) * Math.round(2*leftJoystickYPercent) +
            Math.sin(euler.y) * Math.round(2*leftJoystickXPercent));

        // // Left and Right
        deltaX +=
            0.001 *
            delta *
            (Math.sin(euler.y) * Math.round(2*leftJoystickYPercent) -
            Math.cos(euler.y) * Math.round(2*leftJoystickXPercent));

        if (isWalk){
            if(wDown){
                deltaZ += 0.002 * delta * Math.cos(euler.y);
                deltaX += 0.002 * delta * Math.sin(euler.y);
            }
            if(sDown){
                deltaZ -= 0.002 * delta * Math.cos(euler.y);
                deltaX -= 0.002 * delta * Math.sin(euler.y);
            }
            
            if(qDown){
                deltaZ -= 0.002 * delta * Math.sin(euler.y);
                deltaX += 0.002 * delta * Math.cos(euler.y);
            }
            if(eDown){
                deltaZ += 0.002 * delta * Math.sin(euler.y);
                deltaX -= 0.002 * delta * Math.cos(euler.y);
            }
        }

        // Player Up and Down
        // deltaY = -0.001 * delta * Math.round(2*window.middleJoystickYPercent);
        // Player map zoom
        // deltaK = -0.0005 * delta * Math.round(2*window.middle2JoystickXPercent);

        // boxMesh.position.x += deltaX

        // X Pixel
        // window.playerXZHigh[0] -= deltaX; // / size_of_pixel
        playerWrapper.position.x += deltaX;
        // Y Pixel
        // window.playerXZHigh[1] -= deltaZ; // / size_of_pixel
        playerWrapper.position.z += deltaZ;

        const playerSpeed = Math.sqrt(deltaX*deltaX + deltaZ*deltaZ);
        // console.log(playerSpeed)
        if (playerSpeed == 0.0){
            if (timeSinceStop >= 10){
                playerAnimation = 'dance'
            }else{
                playerAnimation = 'idle'
            }
            
        }else if (playerSpeed <= 0.03){
            timeSinceStop = 0
            playerAnimation = 'walk'
        }else{
            timeSinceStop = 0
            playerAnimation = 'run'
        }

        allCameras["mapCamera"].position.x = playerWrapper.position.x;
        allCameras["mapCamera"].position.y = Math.max(150, playerWrapper.position.y);
        allCameras["mapCamera"].position.z = playerWrapper.position.z-0.1;
        allCameras["mapCamera"].lookAt(playerWrapper.position)

        // Am I in a block
        // Check feet and head
        
        if (`block:${Math.round(playerWrapper.position.x)},${Math.round(playerWrapper.position.y)},${Math.round(playerWrapper.position.z)}:top` in gameObjects){
            // Our feet are in the block, move up
            // console.log('feet hit')
            clearTimeout(moveDownXHR);
            myPlayerTargetPosition.y = Math.round(playerWrapper.position.y)+0.5;
            
        
        }else if(`block:${Math.round(playerWrapper.position.x)},${Math.round(playerWrapper.position.y)+1},${Math.round(playerWrapper.position.z)}:top` in gameObjects){
            // Our head is in the block, move up
            // console.log('head hit')
            myPlayerTargetPosition.y = Math.round(playerWrapper.position.y)+1.5;
            clearTimeout(moveDownXHR);
        
        }else if (`blockVisibility:${Math.round(playerWrapper.position.x)},${Math.round(playerWrapper.position.y)},${Math.round(playerWrapper.position.z)}` in gameObjects &&
            gameObjects[`blockVisibility:${Math.round(playerWrapper.position.x)},${Math.round(playerWrapper.position.y)},${Math.round(playerWrapper.position.z)}`] != ""
        ){
            // We are under ground or inside a structure.
            // console.log("under ground")
            // Not really sure if this works...
            myPlayerTargetPosition.y = Math.ceil(playerWrapper.position.y)+0.5;
            clearTimeout(moveDownXHR);
        
        }else{
            //move down
            moveDownXHR = setTimeout(function(){
                // console.log("move down")
                myPlayerTargetPosition.y = Math.floor(playerWrapper.position.y)-0.5;
            }, 1000)
            
        }

        if(spaceDown){
            myPlayerTargetPosition.y = Math.round(playerWrapper.position.y)+1.0;
            clearTimeout(moveDownXHR);
        }


        // playerWrapper.position.x += stepDistance * (myPlayerTargetPosition.x - playerWrapper.position.x);
        playerWrapper.position.y += 5 * stepDistance * (myPlayerTargetPosition.y - playerWrapper.position.y);
        // playerWrapper.position.z += stepDistance * (myPlayerTargetPosition.z - playerWrapper.position.z);
        // console.log(playerWrapper.position)

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

    // TODO

    entities["player:"+myUuid]['animation'] = playerAnimation;

    for (const entity_key in entities){
        if (entities[entity_key]['mixer']){
            let mixer = entities[entity_key]['mixer'][entities[entity_key]['animation']]
            // console.log("mixer", mixer)
            if (mixer){
                mixer.update( clockDelta/2.0 );
            
            }
        }
    }

    let activeCamera = allCameras[activeCameraName];

    cssRenderer.render(cssScene, activeCamera);

    renderer.setRenderTarget(null);
	renderer.render( scene, activeCamera );

    rendererBackground.setRenderTarget(null);
    rendererBackground.render(objectScene, activeCamera);

    rendererMap.setRenderTarget(null);
    rendererMap.render(scene, allCameras["mapCamera"]);

    if (!(playerWrapper === undefined)){
        // Note the multiplication by negative 1. This should be carried to any other UI components
        positionMap.innerHTML = `<h1>(${-1 * Math.floor(playerWrapper.position.x)}, ${Math.floor(playerWrapper.position.y)}, ${Math.floor(playerWrapper.position.z)})</h1>`
    }
}
animate();