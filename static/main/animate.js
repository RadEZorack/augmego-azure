import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { scene, objectScene, cssScene, camera, renderer, rendererBackground, threeJSContainer, backgroundCanvas } from '../main/main.js';
import { create3dPage, cssRenderer } from '../main/webpage3d.js';
import { CSS3DObject, CSS3DRenderer } from '../three/CSS3DRenderer.js';
import { myPlayerTargetPosition } from '../main/mouseClicks.js';
import { sendPlayerPeerData } from '../main/sendPlayerData.js';
import { redrawObjects } from '../main/redrawObjects.js';
import { entities } from '../main/entity.js';


const stepDistance = 0.01;




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

redrawObjects();

const clock = new THREE.Clock()
function animate() {
    if (stopAnimate){
        // We need the player to interact with the page before things will work correctly.
        // So we loop until we get the flag to start, which can be found on the main page.
        const stopAnimateXHR = setTimeout(function(){
            animate()
        }, 1000)
        return null
    }
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