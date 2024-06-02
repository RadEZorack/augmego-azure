import * as THREE from '../three/three.module.min.js';
import { GLTFLoader } from '../three/GLTFLoader.js';
import { DRACOLoader } from '../three/DRACOLoader.js';
import { objectScene, camera, backgroundCanvas } from '../main/main.js';
import { entities } from '../main/entity.js';
import { initSocketConnection } from '../main/socketConnection.js'

// Instantiate a loader
let gltf_loader = new GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
let dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( "" );
// gltf_loader.setDRACOLoader( dracoLoader );

export let myPlayer = undefined;
export let cameraController = undefined;
export let cameraRotator = undefined;
export let playerWrapper = undefined;

export function loadPlayer(){
  gltf_loader.load(
    // resource URL
    (avatar != "") ? avatar : "https://models.readyplayer.me/64ea136842c59d7dceab60d8.glb",
    // "https://models.readyplayer.me/665b1b74b490861c5f34db84.glb",
    // cesiumManUrl,
    // called when the resource is loaded
    function ( gltf ) {
        gltf.scene.traverse((node) => {
            if (node.isMesh && node.material) {
                node.material.transparent = true;
                // node.material.opacity = 0.5; // Adjust as needed, ranging from 0.0 (fully transparent) to 1.0 (fully opaque)
            }
        });

        myPlayer = gltf;
        const model = gltf.scene;
        model.position.y = 0.9; // after applying the animation mixer, we need to pull the character up
        model.rotation.set(Math.PI/2.0, 0, 0); // same as above, just need to rotate
        let mixer = new THREE.AnimationMixer(model)

        entities["player:"+myUuid] = {
          'gltf': gltf,
          // 'plane': page.plane,
          // 'cssObject': page.cssObject,
          'mixer': mixer,
          'animation': 0,
        }

        // Debugging: Log model details
        // console.log('Model Loaded:', gltf.scene);
        // console.log('Position:', gltf.scene.position);
        // console.log('Scale:', gltf.scene.scale);

        // const box = new THREE.Box3().setFromObject(gltf.scene);
        // const size = box.getSize(new THREE.Vector3());
        // console.log('Model Size:', size);

        // const fbxLoader = new FBXLoader();
        gltf_loader.load(F_Jog_001, function (animGltf) {
            animGltf.animations.forEach(clip => {
              clip.tracks = clip.tracks.filter(track => !track.name.includes('position'));
              const action = mixer.clipAction(clip);
              action.play();
            });
            console.log('Animations Loaded:', animGltf.animations);
        }, undefined, function (error) {
            console.error(error);
        });

        cameraController = new THREE.Object3D;
        cameraRotator = new THREE.Object3D;
        playerWrapper = new THREE.Object3D;

        playerWrapper.add(myPlayer.scene);
        playerWrapper.add(cameraController);
        // playerWrapper.position.y = 0.9; // after applying the animation mixer, we need to pull the character up

        // playerWrapper.add(cameraRotator);
        
        // cameraController.position.x = myPlayer.scene.position.x;
        // cameraController.position.y = myPlayer.scene.position.y;
        // cameraController.position.z = myPlayer.scene.position.z;
        cameraController.add(cameraRotator);
        cameraRotator.add(camera);

        camera.lookAt(new THREE.Vector3(myPlayer.scene.position.x, camera.position.y, myPlayer.scene.position.z));
        // cameraRotator.lookAt(camera);

        objectScene.add( playerWrapper );
        console.log("player loaded");

        initSocketConnection();
    }
  );
}

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