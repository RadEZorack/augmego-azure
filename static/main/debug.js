import * as THREE from '../three/three.module.min.js';

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 0, 5 );
const scene = new THREE.Scene();

const sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
sun.castShadow = true;
sun.position.set(10, 43, 10);
sun.target.position.set(-4, -4, -4);
  scene.add(sun)

const renderer = new THREE.WebGLRenderer({ 
    antialias: false, 
    alpha: true, 
    // stencil: true // Enable stencil
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Set the clear color to fully transparent
// renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);


// Create a plane geometry
var planeGeometry = new THREE.PlaneGeometry(3, 5);

// Create a material, set transparent to true, and adjust opacity
var planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff, // Example color
  transparent: true,
  // opacity: 0.5, // Adjust as needed
  side: THREE.DoubleSide,
});

// Create the plane mesh
var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// planeMesh.renderOrder = 1;

// Add the mesh to your scene
scene.add(planeMesh);

////////////
var planeGeometry2 = new THREE.PlaneGeometry(5, 3);

// Create a material, set transparent to true, and adjust opacity
var planeMaterial2 = new THREE.MeshBasicMaterial({
  color: 0x000000, // Example color
  transparent: true,
  opacity: 0.1, // Adjust as needed
  side: THREE.DoubleSide,
});

// Create the plane mesh
var planeMesh2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
planeMesh2.position.set(0,0,1)
  
// Adjust render order if necessary
planeMesh2.renderOrder = -1; // Render this after the plane (which could have renderOrder = 0)

scene.add(planeMesh2);


// planeMesh2.onBeforeRender = function(renderer, scene, camera, geometry, material, group) {
//     renderer.state.buffers.stencil.setTest(true);
//     renderer.state.buffers.stencil.setFunc(THREE.AlwaysStencilFunc, 1, 0xff);
//     renderer.state.buffers.stencil.setOp(THREE.ReplaceStencilOp, THREE.ReplaceStencilOp, THREE.ReplaceStencilOp);
// };

// planeMesh2.onAfterRender = function(renderer, scene, camera, geometry, material, group) {
//     renderer.state.buffers.stencil.setTest(false);
// };


function render() {
    // Clear previous frame
    renderer.clear();

    // Render plane (mask) to update stencil buffer
    // Make sure the plane itself is not actually drawn to the canvas,
    // for example, by temporarily setting its material to invisible
    // planeMesh2.material.visible = false;
    renderer.render(scene, camera);
    // planeMesh2.material.visible = true;

    // Render rest of the scene with stencil test enabled
    // renderer.state.buffers.stencil.setFunc(THREE.NotEqualStencilFunc, 1, 0xff);
    // renderer.state.buffers.stencil.setOp(THREE.KeepStencilOp, THREE.KeepStencilOp, THREE.KeepStencilOp);
    // renderer.render(scene, camera);

    // // Optional: Reset stencil test so it doesn't affect other renderings
    // renderer.state.buffers.stencil.setTest(false);
}

render();
