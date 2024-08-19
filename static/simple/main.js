import * as THREE from '../three/three.module.min.js';
import { OrbitControls } from '../three/OrbitControls.js';

export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// export const mapCamera = new THREE.OrthographicCamera( -25, 25, 25, -25, 10, 1000 );


export const allCameras = {};
export let activeCameraName = "first person player";
export function modifyActiveCameraName( value ) { activeCameraName = value; };
allCameras["first person player"] = camera;
// allCameras["mapCamera"] = mapCamera;

export const scene = new THREE.Scene();
export const objectScene = new THREE.Scene();
objectScene.background = new THREE.Color(0xB1E1FF); // light blue for sky
scene.add(objectScene)
const geometry = new THREE.PlaneGeometry( 100, 100 );
const material = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );
material.transparent = true;
// material.opacity = 0.0;
const plane = new THREE.Mesh( geometry, material );
plane.position.y = -1
plane.rotateX(Math.PI/2.0);
objectScene.add( plane );

export const cssScene = new THREE.Scene();

// const sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
// sun.castShadow = true;
// sun.position.set(10, 43, 10);
// sun.target.position.set(-4, -4, -4);
  // window.sun.shadowCameraVisible = true;
// objectScene.add(sun)

console.log("Creating renderer");

  export const rendererBackground = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  rendererBackground.shadowMap.enabled = true;
  rendererBackground.setPixelRatio(window.devicePixelRatio);
  rendererBackground.setSize(window.innerWidth, window.innerHeight);
  rendererBackground.domElement.style.position = 'absolute';
  rendererBackground.domElement.style.top = 0;
  rendererBackground.domElement.style.left = 0;
  rendererBackground.domElement.style.zIndex = -1;
  // rendererBackground.domElement.style.pointerEvents = 'none';

  

  export const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = 0;
  renderer.domElement.style.left = 0;
  renderer.domElement.style.zIndex = 2;
  // renderer.domElement.style.pointerEvents = 'none';

  export const threeJSContainer = document.getElementById("threeJSContainer");
  // threeJSContainer.appendChild(rendererColor.domElement);
  export const mainCanvas = threeJSContainer.appendChild(renderer.domElement);
  export const backgroundCanvas = threeJSContainer.appendChild(rendererBackground.domElement);
  // export const mapCanvas = threeJSContainer.appendChild(rendererMap.domElement);
  // threeJSContainer.appendChild(positionMap);

  // TODO: make the following work.
  // $("#rendererMap").on("touchstart click", function(e) {
  //   // Prevent multiple handlers from firing. Remove if you need both touch and click events handled separately.
  //   e.stopPropagation(); 
  //   e.preventDefault();

  //   console.log("trying to buy land")

  //   const obj = selectedObject(e)
    
  //   buyLand(obj.point.position)
  // })

camera.position.set( 0, 0, 5 );

export const controls = new OrbitControls( camera, rendererBackground.domElement );
// controls.autoRotate = true
controls.update();
controls.target.set(0, 0, 0); // Set to the center of your scene or object


// const light = new THREE.HemisphereLight( 0xffffff, 0x888888, 0.8 );
// light.position.set( 0, 1, 0 );
// objectScene.add( light );

