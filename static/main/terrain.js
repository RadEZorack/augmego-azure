import * as THREE from '../three/three.module.min.js';
import { objectScene } from '../main/main.js';

const quadGeometry = new THREE.BufferGeometry();

// 1. Define the vertices for the quad
const quadVertices = new Float32Array( [
    0.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 1.0
] );
  
const quadNormals = new Float32Array( [
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0,
    0.0, 1.0,  0.0
] );
  
// const triangleUVs = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0])
const quadColorPickers = new Float32Array( [
    0.0,
    0.0,
    0.0
] );

// 2. Create a BufferGeometry and set the position attribute
quadGeometry.setAttribute( 'position', new THREE.BufferAttribute( quadVertices, 3 ) );

// 3. (Optionally) Define indices for the quad
const indices = new Uint16Array([
    0, 1, 2,  // First triangle
    2, 1, 3   // Second triangle
]);
quadGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

// quadGeometry.setAttribute( 'normal', new THREE.BufferAttribute( quadNormals, 3 ) );
// quadGeometry.setAttribute( 'uv', new THREE.BufferAttribute( triangleUVs, 2 ) );

const quadMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );

const instanceCount = 1000*1000; // Example: 100 instances

let quadMesh = new THREE.InstancedMesh( quadGeometry, quadMaterial, instanceCount);

const matrix = new THREE.Matrix4();
const position = new THREE.Vector3();
const rotation = new THREE.Euler();
const scale = new THREE.Vector3(1, 1, 1); // Uniform scale for simplicity
const color = new THREE.Color();


for (let i = 0.0; i < instanceCount; i++) {
    let x = i % 1000;
    let y = Math.round(i / 1000);

    // Set random positions as an example
    position.set(
        x,
        0.0,
        y
        // (Math.random() - 0.5) * 10, // Random X between -5 and 5
        // (Math.random() - 0.5) * 10, // Random Y between -5 and 5
        // (Math.random() - 0.5) * 10  // Random Z between -5 and 5
    );

    // Set random rotations as an example
    // rotation.setFromEuler(new THREE.Euler(
    //     0.0,
    //     0.0,
    //     0.0
    //     // Math.random() * Math.PI * 2, // Random rotation around X
    //     // Math.random() * Math.PI * 2, // Random rotation around Y
    //     // Math.random() * Math.PI * 2  // Random rotation around Z
    // ));
    rotation.set(
        0.0,
        0.0,
        0.0
    );

    color.setHex( Math.random() * 0xffffff );

    // matrix.compose(position, rotation, scale);
    // matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
    matrix.setPosition(position);
    quadMesh.setMatrixAt(i, matrix);
    quadMesh.setColorAt( i, color );
}

quadMesh.instanceMatrix.needsUpdate = true; // Important!

objectScene.add(quadMesh);