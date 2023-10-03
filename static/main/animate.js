import * as THREE from '../three/three.module.min.js';
import { myPlayer, myPlayerTargetPosition } from '../main/player.js';
import { scene, objectScene, cssScene, camera, renderer, rendererBackground, rendererColor, threeJSContainer } from '../main/main.js';
import { create3dPage, createCssRenderer } from '../main/webpage3d.js';

const stepDistance = 0.01;

const cssRenderer = createCssRenderer();
threeJSContainer.appendChild(cssRenderer.domElement);

const firstWebPage = create3dPage(100,100,0.01, new THREE.Vector3(5,1,5), new THREE.Vector3(0,0,0), "https://courseware.cemc.uwaterloo.ca/", "")

function animate() {
	requestAnimationFrame( animate );
    
    if (!(myPlayerTargetPosition === undefined) && !(myPlayer === undefined)){
        myPlayer.scene.position.x += stepDistance * (myPlayerTargetPosition.x - myPlayer.scene.position.x);
        myPlayer.scene.position.y += stepDistance * (myPlayerTargetPosition.y - myPlayer.scene.position.y);
        myPlayer.scene.position.z += stepDistance * (myPlayerTargetPosition.z - myPlayer.scene.position.z);
    }

    // required if controls.enableDamping or controls.autoRotate are set to true
	// controls.update();

    cssRenderer.render(cssScene, camera);

    renderer.setRenderTarget(null);
	renderer.render( scene, camera );

    rendererBackground.setRenderTarget(null);
    rendererBackground.render(objectScene, camera);
}
animate();