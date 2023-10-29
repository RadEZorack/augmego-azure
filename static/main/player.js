import * as THREE from '../three/three.module.js';
import { GLTFLoader } from '../three/GLTFLoader.js';
import { DRACOLoader } from '../three/DRACOLoader.js';
import { objectScene, camera, backgroundCanvas } from '../main/main.js';
import { entities } from '../main/entity.js';

// Instantiate a loader
let gltf_loader = new GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
let dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( "" );
gltf_loader.setDRACOLoader( dracoLoader );

export let myPlayer = undefined;
export const cameraController = new THREE.Object3D;
export const cameraRotator = new THREE.Object3D;
export const playerWrapper = new THREE.Object3D;

gltf_loader.load(
    // resource URL
    // "https://models.readyplayer.me/64ea136842c59d7dceab60d8.glb",
    cesiumManUrl,
    // called when the resource is loaded
    function ( gltf ) {
        myPlayer = gltf;

        entities["player:"+myUuid] = {
          'gltf': gltf,
          // 'plane': page.plane,
          // 'cssObject': page.cssObject,
          'mixer': new THREE.AnimationMixer(gltf.scene),
          'animation': 0,
        }

        playerWrapper.add(myPlayer.scene);
        playerWrapper.add(cameraController);
        // playerWrapper.add(cameraRotator);
        
        // cameraController.position.x = myPlayer.scene.position.x;
        // cameraController.position.y = myPlayer.scene.position.y;
        // cameraController.position.z = myPlayer.scene.position.z;
        cameraController.add(cameraRotator);
        cameraRotator.add(camera);

        camera.lookAt(new THREE.Vector3(myPlayer.scene.position.x, camera.position.y, myPlayer.scene.position.z));
        // cameraRotator.lookAt(camera);

        objectScene.add( playerWrapper );
    }
);

// export let myPlayerTargetPosition = undefined;

export function singleClick(event) {
    // Moves Player
    // event.preventDefault();
    // event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      return event.targetTouches[0];
    } else {
      return event;
    }
}

// threeJSContainer.onmousedown = function(event) {
//   console.log(event);
//     event = singleClick(event);
//     event = selectedObject(event);
//     myPlayerTargetPosition = event.point;
//     myPlayer.scene.lookAt(event.point.x, myPlayer.scene.position.y, event.point.z);

//     // const mixer = new THREE.AnimationMixer(myPlayer.scene);
//     // const clip = myPlayer.animations[0]
//     // console.log(clip);
//     // const action = mixer.clipAction( clip );
//     // action.play();
//     // if (mixer){
//     //     mixer.update( 2 * clock.getDelta() );
//     // }
// }