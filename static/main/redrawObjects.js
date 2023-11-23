import * as THREE from '../three/three.module.js';
import { objectScene } from '../main/main.js';
import { vs, fs } from '../main/shaders.js';

export let gameObjects = {};
export let quadMeshInstanceIDKeys = {};


const instanceCount = 10000; // Number of instances you want
const quadMeshs = {};
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const instancedQuad = new THREE.InstancedMesh(quadGeometry, material, instanceCount);
const dummyNorth = new THREE.Object3D();
const dummySouth = new THREE.Object3D();
const dummyEast = new THREE.Object3D();
const dummyWest = new THREE.Object3D();
const dummyTop = new THREE.Object3D();
const dummyBottom = new THREE.Object3D();


export function redrawObjects() {
    for (const key in quadMeshs){
        quadMeshs[key].count = 0;
    }

    const textureCount = {}

    let i = 0;
    for (const key in gameObjects){
        // if (instanceCount < i){
        //     // We've drawn too much, return
        //     return null;
        // }

        
        if (key.startsWith('blockVisibility') && gameObjects[key] == ""){
            // This cube does not have a texture and should not be drawn because it was removed, so continue
            continue;
        }

        
        // Grab the texuture and see how many times it's been drawn, and create a new key if too high.
        const textureUrl = gameObjects[key];
        if (!(textureUrl in textureCount)){
            textureCount[textureUrl] = 1;
        }
        const quadMeshIndex = Math.floor(textureCount[textureUrl] / instanceCount);
        const quadMeshKey = `${quadMeshIndex}:${textureUrl}`

        let quadMesh = undefined;

        if (quadMeshKey in quadMeshs){
            quadMesh = quadMeshs[quadMeshKey];
            quadMesh.count += 1;
            textureCount[textureUrl] += 1;
        }else{
            const texture = new THREE.TextureLoader().load( textureUrl )
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.offset.x = 90/(2*Math.PI);

            const quadMaterial = new THREE.MeshLambertMaterial({
                map: texture
            });

            const quadGeometry = new THREE.PlaneGeometry(1, 1);

            quadMesh = new THREE.InstancedMesh(quadGeometry, quadMaterial, instanceCount);

            quadMesh.castShadow = true;
            quadMesh.receiveShadow = true;

            objectScene.add(quadMesh);
            quadMesh.count = 1;

            quadMeshs[quadMeshKey] = quadMesh;
            quadMeshInstanceIDKeys[quadMesh.uuid] = {}
        }
        quadMeshInstanceIDKeys[quadMesh.uuid][quadMesh.count - 1] = key;






        // Parse the key for coords
        const xyz = key.split(":")[1].split(",");
        const x = parseInt(xyz[0]);
        const y = parseInt(xyz[1]);
        const z = parseInt(xyz[2]);

        const direction = key.split(":")[2]

        // This roundingErrorFix causes us to round in the correct direction when placing or destorying blocks.
        const roundingErrorFix = 0.5001

        switch (direction){
            case "north":
                // Facing North
                dummyNorth.position.set(x,y,z+roundingErrorFix); // Set position
                dummyNorth.rotation.set(0,0,0); // Set rotation
                dummyNorth.updateMatrix();
                quadMesh.setMatrixAt(quadMesh.count - 1, dummyNorth.matrix);
                break;
            
            case "south":
                // Facing South
                dummySouth.position.set(x,y,z-roundingErrorFix); // Set position
                dummySouth.rotation.set(0,Math.PI,0); // Set rotation
                dummySouth.updateMatrix();
                quadMesh.setMatrixAt(quadMesh.count - 1, dummySouth.matrix);
                break;

            case "east":
                // Facing East
                dummyEast.position.set(x-roundingErrorFix,y,z); // Set position
                dummyEast.rotation.set(0,-Math.PI/2,0); // Set rotation
                dummyEast.updateMatrix();
                quadMesh.setMatrixAt(quadMesh.count - 1, dummyEast.matrix);
                break;

            case "west":
                // Facing West
                dummyWest.position.set(x+roundingErrorFix,y,z); // Set position
                dummyWest.rotation.set(0,Math.PI/2,0); // Set rotation
                dummyWest.updateMatrix();
                quadMesh.setMatrixAt(quadMesh.count - 1, dummyWest.matrix);
                break;

            case "top":
                // Facing Up/top
                dummyTop.position.set(x,y+roundingErrorFix,z); // Set position
                dummyTop.rotation.set(-Math.PI/2,0,0); // Set rotation
                dummyTop.updateMatrix();
                quadMesh.setMatrixAt(quadMesh.count - 1, dummyTop.matrix);
                break;

            case "bottom":
                // Facing Up/top
                dummyBottom.position.set(x,y-roundingErrorFix,z); // Set position
                dummyBottom.rotation.set(Math.PI/2,0,0); // Set rotation
                dummyBottom.updateMatrix();
                quadMesh.setMatrixAt(quadMesh.count - 1, dummyBottom.matrix);
                break;
        }
        // increment our short ciruit counter
        i += 1;

        quadMesh.instanceMatrix.needsUpdate = true;
        

    }

    

}