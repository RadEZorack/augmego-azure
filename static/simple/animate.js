import * as THREE from '../three/three.module.min.js';
// import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { scene, objectScene, cssScene, allCameras, activeCameraName, renderer, rendererBackground, controls } from '../simple/main.js';
import { cssRenderer } from '../simple/webpage3d.js';

function animate() {

	requestAnimationFrame( animate );

    controls.update();

    let activeCamera = allCameras[activeCameraName];

    cssRenderer.render(cssScene, activeCamera);

    renderer.setRenderTarget(null);
	renderer.render( scene, activeCamera );

    rendererBackground.setRenderTarget(null);
    rendererBackground.render(objectScene, activeCamera);
}
animate();