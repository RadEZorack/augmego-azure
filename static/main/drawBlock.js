import { gameObjects, quadMeshInstanceIDKeys } from "./redrawObjects.js";
import { toggleMouseState } from "./mouseClicks.js";
import * as THREE from '../three/three.module.min.js';
import { objectScene } from '../main/main.js';

export let chunkGameObjects = {}
const CHUNK_SIZE = 50

export function drawBlock(x, y, z, texture_name) {
    // console.log(texture_name)
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);

    const chunkX = Math.floor(x/CHUNK_SIZE)*CHUNK_SIZE
    const chunkY = Math.floor(y/CHUNK_SIZE)*CHUNK_SIZE
    const chunkZ = Math.floor(z/CHUNK_SIZE)*CHUNK_SIZE

    const chunkKey = `${chunkX},${chunkY},${chunkZ}`
    if (!(chunkKey in chunkGameObjects)){
        chunkGameObjects[chunkKey] = new Set([])
    }

    // chunkGameObjects[chunkKey].add(`${x},${y},${z}`)

    // Defines if the gameobject exists even if it's hidden. This could probably be added in the the other keys.
    // gameObjects[`blockVisibility:${x},${y},${z}`] = texture_name;
    
    if (texture_name == "") {
        // If there is no texture, we don't want to draw or remove anything adjacent.
        return null;
    }

    // We check the TOP of the adjacent block
    if (`block:${x},${y-1},${z}:top` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x},${y-1},${z}:top`]
        chunkGameObjects[chunkKey].delete(`block:${x},${y},${z}:top`)
        
    } else {
        // No adjancent block, draw the new BOTTOM face
        gameObjects[`block:${x},${y},${z}:bottom`] = {x:x, y:y, z:z, direction:"bottom", texture_name:texture_name};
        chunkGameObjects[chunkKey].add(`block:${x},${y},${z}:bottom`)
    }

    // We check the BOTTOM of the adjacent block
    if (`block:${x},${y+1},${z}:bottom` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x},${y+1},${z}:bottom`]
        chunkGameObjects[chunkKey].delete(`block:${x},${y},${z}:bottom`)

    } else {
        // No adjancent block, draw the new TOP face
        gameObjects[`block:${x},${y},${z}:top`] = {x:x, y:y, z:z, direction:"top", texture_name:texture_name};
        chunkGameObjects[chunkKey].add(`block:${x},${y},${z}:top`)
    }

    // We check the NORTH of the adjacent block
    if (`block:${x},${y},${z-1}:north` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x},${y},${z-1}:north`]
        chunkGameObjects[chunkKey].delete(`block:${x},${y},${z}:north`)

    } else {
        // No adjancent block, draw the new SOUTH face
        gameObjects[`block:${x},${y},${z}:south`] = {x:x, y:y, z:z, direction:"south", texture_name:texture_name};
        chunkGameObjects[chunkKey].add(`block:${x},${y},${z}:south`)
    }

    // We check the SOUTH of the adjacent block
    if (`block:${x},${y},${z+1}:south` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x},${y},${z+1}:south`]
        chunkGameObjects[chunkKey].delete(`block:${x},${y},${z}:south`)
        
    } else {
        gameObjects[`block:${x},${y},${z}:north`] = {x:x, y:y, z:z, direction:"north", texture_name:texture_name};
        chunkGameObjects[chunkKey].add(`block:${x},${y},${z}:north`)
    }

    // We check the WEST of the adjacent block
    if (`block:${x-1},${y},${z}:west` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x-1},${y},${z}:west`]
        chunkGameObjects[chunkKey].delete(`block:${x},${y},${z}:west`)
        
    } else {
        gameObjects[`block:${x},${y},${z}:east`] = {x:x, y:y, z:z, direction:"east", texture_name:texture_name};
        chunkGameObjects[chunkKey].add(`block:${x},${y},${z}:east`)
    }

    // We check the EAST of the adjacent block
    if (`block:${x+1},${y},${z}:east` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x+1},${y},${z}:east`]
        chunkGameObjects[chunkKey].delete(`block:${x},${y},${z}:east`)
        
    } else {
        gameObjects[`block:${x},${y},${z}:west`] = {x:x, y:y, z:z, direction:"west", texture_name:texture_name};
        chunkGameObjects[chunkKey].add(`block:${x},${y},${z}:west`)
    }
}

export function drawBlockColor(x,y,z,color){
    return;
    // console.log(texture_name)
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);

    if (`block:${x},${y},${z}:bottom` in gameObjects){
        gameObjects[`block:${x},${y},${z}:bottom`].color = color;
    }
    if (`block:${x},${y},${z}:top` in gameObjects){
        gameObjects[`block:${x},${y},${z}:top`].color = color;
    }
    if (`block:${x},${y},${z}:north` in gameObjects){
        gameObjects[`block:${x},${y},${z}:north`].color = color;
    }
    if (`block:${x},${y},${z}:south` in gameObjects){
        gameObjects[`block:${x},${y},${z}:south`].color = color;
    }
    if (`block:${x},${y},${z}:east` in gameObjects){
        gameObjects[`block:${x},${y},${z}:east`].color = color;
    }
    if (`block:${x},${y},${z}:west` in gameObjects){
        gameObjects[`block:${x},${y},${z}:west`].color = color;
    }
}

export let boxMesh = undefined;
export function drawTempBlock(data){
    // const texture = new THREE.TextureLoader().load( texture_name )
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // // texture.offset.x = 90/(2*Math.PI);

    // const boxMaterial = new THREE.MeshLambertMaterial({
    //     map: texture,
    //     transparent: true,
    // });

    //reset
    if (boxMesh != undefined){
        objectScene.remove(boxMesh);
    }
 
    //green
    let color = 0x00ff00
    if (toggleMouseState == "destroy"){
        //red
        color = 0xff0000
    }else if (toggleMouseState == "create"){
        //green
        color = 0x00ff00

    }
    const boxMaterial = new THREE.MeshBasicMaterial({ color: color, wireframe: true });

    const boxGeometry = new THREE.BoxGeometry(1, 1);

    boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    // boxMesh.castShadow = true;
    // boxMesh.receiveShadow = true;
    // let data = selectedObject(event)
    if (toggleMouseState == "destroy" && data != undefined && data.object != undefined && data.object.uuid != undefined && data.instanceId != undefined){
        const key = quadMeshInstanceIDKeys[data.object.uuid][data.instanceId];
        const keyArray = key.split(":")
        const xyz = keyArray[1].split(",");
        const x = Math.round(xyz[0])
        const y = Math.round(xyz[1])
        const z = Math.round(xyz[2])
        boxMesh.position.x = x;
        boxMesh.position.y = y;
        boxMesh.position.z = z;
    }else if (toggleMouseState == "create"){
        const x = Math.round(data.point.x)
        const y = Math.round(data.point.y)
        const z = Math.round(data.point.z)
        boxMesh.position.x = x;
        boxMesh.position.y = y;
        boxMesh.position.z = z;
    }

    objectScene.add(boxMesh);
}

export function removeTempBlock(){
    if (boxMesh != undefined){
        objectScene.remove(boxMesh);
    }
}