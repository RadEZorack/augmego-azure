import * as THREE from '../three/three.module.min.js';
// import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { objectScene, cssScene, allCameras, activeCameraName, rendererBackground } from '../simple/main.js';
import { cssRenderer } from '../simple/webpage3d.js';
// import { CSS3DObject, CSS3DRenderer } from '../three/CSS3DRenderer.js';
// import { myPlayerTargetPosition } from '../main/mouseClicks.js';
// import { sendPlayerPeerData } from '../main/sendPlayerData.js';
// import { gameObjects, startRedrawObjectsSpinner } from '../main/redrawObjects.js';
// import { entities } from '../simple/entity.js';
// import { rightJoystickXPercent, rightJoystickYPercent, leftJoystickYPercent, leftJoystickXPercent } from '../main/controls.js';
// import { qDown, wDown, eDown, aDown, sDown, dDown, spaceDown } from '../main/QWEASD.js'
// import { isWalk } from '../main/commands.js'


const stepDistance = 0.01;



// redrawObjects();

const clock = new THREE.Clock()
let moveDownXHR = undefined;
let lastTime = 0;
const euler = new THREE.Euler(0, 0, 0, "YXZ");
const PI_2 = Math.PI / 2;
let stopSpinner = false;

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

    // sendPlayerPeerData();

    // required if controls.enableDamping or controls.autoRotate are set to true
	// controls.update();

    const clockDelta = clock.getDelta()

    // for (const entity_key in entities){
    //     let mixer = entities[entity_key]['mixer']
    //     if (mixer){
    //         mixer.update( clockDelta/2.0 );
    //     }
    // }

    let activeCamera = allCameras[activeCameraName];

    cssRenderer.render(cssScene, activeCamera);

    // renderer.setRenderTarget(null);
	// renderer.render( scene, activeCamera );

    rendererBackground.setRenderTarget(null);
    rendererBackground.render(objectScene, activeCamera);

    // rendererMap.setRenderTarget(null);
    // rendererMap.render(scene, allCameras["mapCamera"]);

    // if (!(playerWrapper === undefined)){
    //     // Note the multiplication by negative 1. This should be carried to any other UI components
    //     positionMap.innerHTML = `<h1>(${-1 * Math.floor(playerWrapper.position.x)}, ${Math.floor(playerWrapper.position.y)}, ${Math.floor(playerWrapper.position.z)})</h1>`
    // }
}
animate();