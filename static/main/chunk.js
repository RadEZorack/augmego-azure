import * as THREE from '../three/three.module.js';
import { gameObjects, redrawObjects } from "./redrawObjects.js";
import { drawBlockColor } from "./drawBlock.js";
import { playerWrapper } from '../main/player.js';

const errorMargin = 0.1

let drawChunkBoundsXHR = undefined;

export function drawChunkBounds(toggleLandClaimView){
    // console.log(playerWrapper);
    if (playerWrapper == undefined){
        drawChunkBoundsXHR = setTimeout(function(){
            drawChunkBounds()
        }, 1000)
    }else{
        const thisChunkPosition = new THREE.Vector3(
            Math.floor(playerWrapper.position.x/10)*10,
            Math.floor(playerWrapper.position.y/10)*10,
            Math.floor(playerWrapper.position.z/10)*10
        );

        const x = thisChunkPosition.x;
        const y = thisChunkPosition.y;
        const z = thisChunkPosition.z;
        
        // console.log(thisChunkPosition)
        $.ajax({
            url: chunkInfoURL,
            type: 'GET',
            data: {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                x: Math.floor(x/10),
                y: Math.floor(y/10),
                z: Math.floor(z/10)
            },
            success: function(resp) {
                console.log(resp);
                // returns { plane: plane, cssObject: cssObject, scale: s }
                for (let chunkKey in resp){
                    // console.log(chunkKey)
                    let chunkKeySplit = chunkKey.split(":")
                    chunkKeySplit = chunkKeySplit[1].split(",")
                    const xChunk = Number.parseInt(chunkKeySplit[0].split("=")[1])
                    // const yChunk = Number.parseInt(chunkKeySplit[1].split("=")[1])
                    const zChunk = Number.parseInt(chunkKeySplit[2].split("=")[1])
                    for (let i = xChunk * 10; i < 10 + xChunk * 10; i++){
                        // TODO we probably want chunks going to the sky and bedrock
                        for (let j = -100; j < 100; j++){
                            for (let k = zChunk * 10; k < 10 + zChunk * 10; k++){
                                if(toggleLandClaimView == true){
                                    // add color
                                    drawBlockColor(i, j, k, resp[chunkKey])
                                }else{
                                    // remove color
                                    drawBlockColor(i, j, k, "")
                                }
                                
                            }
                        }
                    }
                }
                redrawObjects();
            }
        })
    }
    
}

export function buyLand(){
    const thisChunkPosition = new THREE.Vector3(
        Math.floor(playerWrapper.position.x/10)*10,
        Math.floor(playerWrapper.position.y/10)*10,
        Math.floor(playerWrapper.position.z/10)*10
    );

    const x = thisChunkPosition.x;
    const y = thisChunkPosition.y;
    const z = thisChunkPosition.z;

    $.ajax({
        url: chunkPurchaseURL,
        type: 'POST',
        data: {
        csrfmiddlewaretoken: csrfmiddlewaretoken,
        x: Math.floor(x/10),
        y: Math.floor(y/10),
        z: Math.floor(z/10)
        },
        success: function(resp) {
        console.log("success buy");
        }
    })
}
