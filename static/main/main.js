import * as THREE from '../three/three.module.min.js';

export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
export const mapCamera = new THREE.OrthographicCamera( -25, 25, 25, -25, 10, 1000 );


export const allCameras = {};
export let activeCameraName = "third person player";
export function modifyActiveCameraName( value ) { activeCameraName = value; };
allCameras["third person player"] = camera;
allCameras["mapCamera"] = mapCamera;

export const scene = new THREE.Scene();
export const objectScene = new THREE.Scene();
objectScene.background = new THREE.Color(0xB1E1FF); // light blue for sky
scene.add(objectScene)
export const cssScene = new THREE.Scene();

const sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
sun.castShadow = true;
sun.position.set(10, 43, 10);
// sun.target.position.set(-4, -4, -4);
  // window.sun.shadowCameraVisible = true;
objectScene.add(sun)

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
  renderer.domElement.style.pointerEvents = 'none';

  export const rendererMap = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  // renderer.shadowMap.enabled = true;
  rendererMap.setPixelRatio(window.devicePixelRatio);
  rendererMap.setSize(window.innerWidth/5, window.innerWidth/5);
  rendererMap.domElement.style.position = 'absolute';
  rendererMap.domElement.style.top = 0;
  rendererMap.domElement.style.right = 0;
  rendererMap.domElement.style.zIndex = 3;
  rendererMap.domElement.style.pointerEvents = 'none';
  rendererMap.domElement.id = "rendererMap";

  // Not used
  // export const rendererColor = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  // rendererColor.setPixelRatio(window.devicePixelRatio);
  // rendererColor.setSize(window.innerWidth, window.innerHeight);
  // rendererColor.domElement.style.position = 'absolute';
  // rendererColor.domElement.style.top = 0;
  // rendererColor.domElement.style.left = 0;
  // rendererColor.domElement.style.zIndex = 3;
  // rendererColor.domElement.style.pointerEvents = 'none';

  // Moved to animate.js
  // cssRenderer.domElement.appendChild(rendererColor.domElement);
  // cssRenderer.domElement.appendChild(renderer.domElement);
  // cssRenderer.domElement.appendChild(rendererBackground.domElement);

  export const threeJSContainer = document.getElementById("threeJSContainer");
  // threeJSContainer.appendChild(rendererColor.domElement);
  export const mainCanvas = threeJSContainer.appendChild(renderer.domElement);
  export const backgroundCanvas = threeJSContainer.appendChild(rendererBackground.domElement);
  export const mapCanvas = threeJSContainer.appendChild(rendererMap.domElement);

camera.position.set( 0, 2, -5 );

const light = new THREE.HemisphereLight( 0xffffff, 0x888888, 0.8 );
light.position.set( 0, 1, 0 );
objectScene.add( light );

