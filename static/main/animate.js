import { myPlayer, myPlayerTargetPosition } from '../main/player.js';
import { objectScene, camera, renderer } from '../main/main.js';

const stepDistance = 0.01;

function animate() {
	requestAnimationFrame( animate );
    
    if (!(myPlayerTargetPosition === undefined) && !(myPlayer === undefined)){
        myPlayer.scene.position.x += stepDistance * (myPlayerTargetPosition.x - myPlayer.scene.position.x);
        myPlayer.scene.position.y += stepDistance * (myPlayerTargetPosition.y - myPlayer.scene.position.y);
        myPlayer.scene.position.z += stepDistance * (myPlayerTargetPosition.z - myPlayer.scene.position.z);
    }

    // required if controls.enableDamping or controls.autoRotate are set to true
	// controls.update();

	renderer.render( objectScene, camera );
}
animate();