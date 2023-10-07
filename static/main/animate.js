import * as THREE from '../three/three.module.js';
import { myPlayer, singleClick } from '../main/player.js';
import { scene, objectScene, cssScene, camera, renderer, rendererBackground, threeJSContainer } from '../main/main.js';
import { create3dPage, createCssRenderer, createGlRenderer } from '../main/webpage3d.js';
import { CSS3DObject, CSS3DRenderer } from '../three/CSS3DRenderer.js';
import { selectedObject } from '../main/raycaster.js';

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