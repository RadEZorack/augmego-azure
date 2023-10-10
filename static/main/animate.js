import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick, cameraController, playerWrapper, cameraRotator } from '../main/player.js';
import { scene, objectScene, cssScene, camera, renderer, rendererBackground, threeJSContainer } from '../main/main.js';
import { create3dPage, createCssRenderer, createGlRenderer } from '../main/webpage3d.js';
import { CSS3DObject, CSS3DRenderer } from '../three/CSS3DRenderer.js';
import { selectedObject } from '../main/raycaster.js';
import { sendPlayerPeerData } from '../main/sendPlayerData.js';


const stepDistance = 0.01;

// const cssRenderer = createCssRenderer();
// threeJSContainer.appendChild(cssRenderer.domElement);

// const firstWebPage = create3dPage(1200,1200,0.004, new THREE.Vector3(5,1,5), new THREE.Vector3(0,0,0), "https://courseware.cemc.uwaterloo.ca/", "")

// function createCSS3DObject(s) {
//     // convert the string to dome elements
//     var wrapper = document.createElement('div');
//     wrapper.innerHTML = s;
//     var div = wrapper.firstChild;

//     // set some values on the div to style it, standard CSS
//     div.style.width = '370px';
//     div.style.height = '370px';
//     div.style.opacity = 0.7;
//     div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();

//     // create a CSS3Dobject and return it.
//     var object = new CSS3DObject(div);
//     return object;
// }

// const string =
//       '<iframe src="' +
//       "https://courseware.cemc.uwaterloo.ca/" +
//       '" width="' +
//       "370px" +
//       'px" height="' +
//       "370px" +
//       'px" allow="autoplay">' +
//       "</iframe>";

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);

// add the output of the renderer to the html element
let cssDiv = document.body.appendChild(cssRenderer.domElement);

let myPlayerTargetPosition = undefined;

cssDiv.onmousedown = function(event) {
    // console.log(event);
      let prevScreenPosition = new THREE.Vector2(event.clientX,event.clientY);
    //   let currentScreenPosition = new THREE.Vector2(event.clientX,event.clientY);
      const mouseSensitivity = 0.05; // Adjust to your liking

      event = singleClick(event);
      event = selectedObject(event);
    //   console.log(event);
    //   console.log(myPlayer);
    //   console.log(event.object.parent.parent.uuid);
    //   console.log(myPlayer.scene.uuid);

      if ( !(event.object == undefined)
        && !(event.object.parent == undefined)
        && !(event.object.parent.parent == undefined)
        && !(myPlayer.scene == undefined)
        // && !(myPlayer.scene.parent == undefined)
        // && !(myPlayer.scene.parent.parent == undefined)
        && event.object.parent.parent.uuid == myPlayer.scene.uuid){
                cssDiv.onmousemove = function(event) {
                    let currentScreenPosition = new THREE.Vector2(event.clientX,event.clientY);
                    if(!(prevScreenPosition.x == currentScreenPosition.x)){
                        const sensitivityX = 0.01;

                        const deltaX = prevScreenPosition.x - currentScreenPosition.x
                        cameraController.rotateY(sensitivityX * Math.PI * deltaX);

                        camera.lookAt(playerWrapper.position);
                    }
                    if(!(prevScreenPosition.y == currentScreenPosition.y)){
                      const sensitivityY = 0.01;

                      const deltaY = prevScreenPosition.y - currentScreenPosition.y;
                      cameraRotator.rotateX(- sensitivityY * Math.PI * deltaY);

                      camera.lookAt(playerWrapper.position);
                  }
                    prevScreenPosition = currentScreenPosition;
                    cssDiv.onmouseup = function(event) {
                        cssDiv.onmousemove = undefined;
                    }
                }

        return;
      }else{
        myPlayerTargetPosition = event.point;
        // const previousRotation = new THREE.Euler(myPlayer.scene.rotation);
        myPlayer.scene.lookAt(event.point.x, myPlayer.scene.position.y, event.point.z);
        // const currentRotation = new THREE.Euler(myPlayer.scene.rotation);
        // cameraController.setRotationFromEuler(previousRotation - currentRotation);
        
      }
      
  
      // const mixer = new THREE.AnimationMixer(myPlayer.scene);
      // const clip = myPlayer.animations[0]
      // console.log(clip);
      // const action = mixer.clipAction( clip );
      // action.play();
      // if (mixer){
      //     mixer.update( 2 * clock.getDelta() );
      // }
  }



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
// cssElement.position.set(5, 1, 5);
// cssScene.add(cssElement);


function animate() {
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
}
animate();