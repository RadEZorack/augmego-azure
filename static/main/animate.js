import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { scene, objectScene, cssScene, camera, allCameras, activeCameraName, renderer, rendererBackground, threeJSContainer, backgroundCanvas } from '../main/main.js';
import { create3dPage, cssRenderer } from '../main/webpage3d.js';
import { CSS3DObject, CSS3DRenderer } from '../three/CSS3DRenderer.js';
import { myPlayerTargetPosition } from '../main/mouseClicks.js';
import { sendPlayerPeerData } from '../main/sendPlayerData.js';
import { gameObjects } from '../main/redrawObjects.js';
import { entities } from '../main/entity.js';


const stepDistance = 0.01;



// redrawObjects();

const clock = new THREE.Clock()
let moveDownXHR = undefined;
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


        playerWrapper.position.x += stepDistance * (myPlayerTargetPosition.x - playerWrapper.position.x);
        playerWrapper.position.y += 5 * stepDistance * (myPlayerTargetPosition.y - playerWrapper.position.y);
        playerWrapper.position.z += stepDistance * (myPlayerTargetPosition.z - playerWrapper.position.z);
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