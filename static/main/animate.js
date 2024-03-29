import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { scene, objectScene, cssScene, camera, allCameras, activeCameraName, renderer, rendererBackground, rendererMap, threeJSContainer, backgroundCanvas } from '../main/main.js';
import { create3dPage, cssRenderer } from '../main/webpage3d.js';
import { CSS3DObject, CSS3DRenderer } from '../three/CSS3DRenderer.js';
import { myPlayerTargetPosition } from '../main/mouseClicks.js';
import { sendPlayerPeerData } from '../main/sendPlayerData.js';
import { gameObjects } from '../main/redrawObjects.js';
import { entities } from '../main/entity.js';
import { rightJoystickXPercent, rightJoystickYPercent, leftJoystickYPercent, leftJoystickXPercent } from '../main/controls.js';
import { qDown, wDown, eDown, aDown, sDown, dDown, spaceDown, isWalk } from '../main/QWEASD.js'


const stepDistance = 0.01;



// redrawObjects();

const clock = new THREE.Clock()
let moveDownXHR = undefined;
let lastTime = 0;
const euler = new THREE.Euler(0, 0, 0, "YXZ");
const PI_2 = Math.PI / 2;

function animate() {
    if (stopAnimate == true){
        // We need the player to interact with the page before things will work correctly.
        // So we loop until we get the flag to start, which can be found on the main page.
        const stopAnimateXHR = setTimeout(function(){
            animate()
        }, 1000)
        return null
    }
	requestAnimationFrame( animate );
    
    if (!(playerWrapper === undefined)){
        const time = performance.now();

        const delta = time - lastTime;

        // window.sun.position.y -= 0.001*delta;

        lastTime =  time;

        let deltaZ = 0;
        let deltaX = 0;
        // let deltaY = 0;
        // let deltaK = 0;

        euler.setFromQuaternion(playerWrapper.quaternion);

        euler.y -= 0.0002 * delta * (Math.round(2*rightJoystickXPercent) * PI_2);
        if (isWalk){
            if(aDown){
                euler.y += 0.0004 * delta * PI_2;
            }
            if(dDown){
                euler.y -= 0.0004 * delta * PI_2;
            }
        }


        euler.x -= 0.0002 * delta * (Math.round(2*rightJoystickYPercent) * PI_2);
        euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));

        playerWrapper.quaternion.setFromEuler(euler);

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

        allCameras["mapCamera"].position.x = playerWrapper.position.x + 25;
        allCameras["mapCamera"].position.y = Math.max(50, playerWrapper.position.y);
        allCameras["mapCamera"].position.z = playerWrapper.position.z - 25;
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

    let activeCamera = allCameras[activeCameraName];

    cssRenderer.render(cssScene, activeCamera);

    renderer.setRenderTarget(null);
	renderer.render( scene, activeCamera );

    rendererBackground.setRenderTarget(null);
    rendererBackground.render(objectScene, activeCamera);

    rendererMap.setRenderTarget(null);
    rendererMap.render(scene, allCameras["mapCamera"]);

    const clockDelta = clock.getDelta()

    for (const entity_key in entities){
        let animation = entities[entity_key]['animation']
        if (animation != undefined){
          // console.log("animating")
          const gltf = entities[entity_key]['gltf']
            let mixer = entities[entity_key]['mixer']
            let clip = gltf.animations[animation]
            let action = mixer.clipAction( clip );
            action.play();
            if (mixer){
                mixer.update( 2 * clockDelta );
            }
        }
    }
}
animate();