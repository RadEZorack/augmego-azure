import * as THREE from '../three/three.module.js';
import { objectScene } from '../main/main.js';

export let gameObjects = {};
export let triangleMeshInstanceIDKeys = {};

const quadGeometry = new THREE.PlaneGeometry(1, 1);
const instanceCount = 100; // Number of instances you want
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const instancedQuad = new THREE.InstancedMesh(quadGeometry, material, instanceCount);
const dummyNorth = new THREE.Object3D();
const dummySouth = new THREE.Object3D();
const dummyEast = new THREE.Object3D();
const dummyWest = new THREE.Object3D();
const dummyTop = new THREE.Object3D();
const dummyBottom = new THREE.Object3D();


export function redrawObjects() {
    let i = 0;
    for (const key in gameObjects){
        if (instanceCount < i){
            // We've drawn too much, return
          return null;
        }
        if (key.startsWith('blockVisibility')){
            // This is just meta data about the cube, so continue
          continue;
        }

        // Grab the gameobject
        const gameObject = gameObjects[key];

        // Parse the key for coords
        const xyz = key.split(":")[1].split(",");
        const x = parseInt(xyz[0]);
        const y = parseInt(xyz[1]);
        const z = parseInt(xyz[2]);

        const direction = key.split(":")[3]

        switch (direction){
            case "north":
                // Facing North
                dummyNorth.position.set(x,y,z+0.5); // Set position
                dummyNorth.rotation.set(0,0,0); // Set rotation
                dummyNorth.updateMatrix();
                instancedQuad.setMatrixAt(i, dummyNorth.matrix);
                break;
            
            case "south":
                // Facing South
                dummySouth.position.set(x,y,z-0.5); // Set position
                dummySouth.rotation.set(0,Math.PI,0); // Set rotation
                dummySouth.updateMatrix();
                instancedQuad.setMatrixAt(i, dummySouth.matrix);
                break;

            case "east":
                // Facing East
                dummyEast.position.set(x-0.5,y,z); // Set position
                dummyEast.rotation.set(0,-Math.PI/2,0); // Set rotation
                dummyEast.updateMatrix();
                instancedQuad.setMatrixAt(i, dummyEast.matrix);
                break;

            case "west":
                // Facing West
                dummyWest.position.set(x+0.5,y,z); // Set position
                dummyWest.rotation.set(0,Math.PI/2,0); // Set rotation
                dummyWest.updateMatrix();
                instancedQuad.setMatrixAt(i, dummyWest.matrix);
                break;

            case "top":
                // Facing Up/top
                dummyTop.position.set(x,y+0.5,z); // Set position
                dummyTop.rotation.set(-Math.PI/2,0,0); // Set rotation
                dummyTop.updateMatrix();
                instancedQuad.setMatrixAt(i, dummyTop.matrix);
                break;

            case "bottom":
                // Facing Up/top
                dummyBottom.position.set(x,y-0.5,z); // Set position
                dummyBottom.rotation.set(Math.PI/2,0,0); // Set rotation
                dummyBottom.updateMatrix();
                instancedQuad.setMatrixAt(i, dummyBottom.matrix);
                break;
        }
        // increment our short ciruit counter
        i += 1;
    }

    instancedQuad.instanceMatrix.needsUpdate = true;

    objectScene.add(instancedQuad);

}