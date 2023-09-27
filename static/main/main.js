import * as THREE from '../three/three.module.min.js';
import { OrbitControls } from '../three/OrbitControls.js';

export const objectScene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
// const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
export const mainCanvas = document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// objectScene.add( cube );

camera.position.z = 5;

const light = new THREE.HemisphereLight( 0xffffff, 0x888888, 3 );
light.position.set( 0, 1, 0 );
objectScene.add( light );

function animate() {
	requestAnimationFrame( animate );

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( objectScene, camera );
}
animate();