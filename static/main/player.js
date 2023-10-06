import * as THREE from '../three/three.module.js';
import { GLTFLoader } from '../three/GLTFLoader.js';
import { DRACOLoader } from '../three/DRACOLoader.js';
import { objectScene, camera, mainCanvas } from '../main/main.js';
import { selectedObject } from '../main/raycaster.js';

// Instantiate a loader
let gltf_loader = new GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
let dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( "" );
gltf_loader.setDRACOLoader( dracoLoader );

export let myPlayer = undefined;

gltf_loader.load(
    // resource URL
    "https://models.readyplayer.me/64ea136842c59d7dceab60d8.glb",
    // called when the resource is loaded
    function ( gltf ) {
        myPlayer = gltf;

        camera.lookAt(myPlayer.scene.position);
        myPlayer.scene.add(camera);

        objectScene.add( myPlayer.scene );
    }
);

export let myPlayerTargetPosition = undefined;

function singleClick(event) {
    // Moves Player
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      return event.targetTouches[0];
    } else {
      return event;
    }
}

mainCanvas.onmousedown = function(event) {
    event = singleClick(event);
    event = selectedObject(event);
    myPlayerTargetPosition = event.point;
    myPlayer.scene.lookAt(event.point.x, myPlayer.scene.position.y, event.point.z);

    // const mixer = new THREE.AnimationMixer(myPlayer.scene);
    // const clip = myPlayer.animations[0]
    // console.log(clip);
    // const action = mixer.clipAction( clip );
    // action.play();
    // if (mixer){
    //     mixer.update( 2 * clock.getDelta() );
    // }
}