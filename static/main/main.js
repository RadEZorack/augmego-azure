import * as THREE from '../three/three.module.js';

export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

export const scene = new THREE.Scene();
export const objectScene = new THREE.Scene();
objectScene.background = new THREE.Color(0xB1E1FF); // light blue for sky
scene.add(objectScene)
export const cssScene = new THREE.Scene();

const sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
sun.castShadow = true;
// sun.position.set(40, 40, 40);
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

camera.position.set( 0, 2, -5 );

const light = new THREE.HemisphereLight( 0xffffff, 0x888888, 0.8 );
light.position.set( 0, 1, 0 );
objectScene.add( light );

