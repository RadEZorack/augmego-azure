import * as THREE from '../three/three.module.js';
import { gameObjects, redrawObjects } from "./redrawObjects.js";
import { drawBlockColor } from "./drawBlock.js";
import { playerWrapper } from '../main/player.js';

const errorMargin = 0.1

let drawChunkBoundsXHR = undefined;

function drawChunkBounds(chunkPosition){
    let thisChunkPosition = new THREE.Vector3(0.0, 0.0, 0.0);
    // console.log(playerWrapper);
    if (playerWrapper != undefined){
        thisChunkPosition = new THREE.Vector3(
            Math.floor(playerWrapper.position.x/10)*10,
            Math.floor(playerWrapper.position.y/10)*10,
            Math.floor(playerWrapper.position.z/10)*10
        );

        const x = thisChunkPosition.x;
        const y = thisChunkPosition.y;
        const z = thisChunkPosition.z;
        
        console.log(chunkPosition, thisChunkPosition)
        if (chunkPosition == undefined || chunkPosition.x != x || chunkPosition.y != y || chunkPosition.z != z){ 
            for (let a = -1; a <= 1; a++){
                for (let b = -1; b <= 1; b++){
                    for (let c = -1; c <= 1; c++){
                        console.log(Math.floor(x/10)+a, Math.floor(y/10)+b, Math.floor(z/10)+c)
            
                        $.ajax({
                            url: chunkInfoURL,
                            type: 'GET',
                            data: {
                                csrfmiddlewaretoken: csrfmiddlewaretoken,
                                x: Math.floor(x/10)+a,
                                y: Math.floor(y/10)+b,
                                z: Math.floor(z/10)+c
                            },
                            success: function(resp) {
                                console.log(resp);
                                // returns { plane: plane, cssObject: cssObject, scale: s }
                                for (let i = x + a * 10; i < x + 10 + a * 10; i++){
                                    for (let j = y + b * 10; j < y + 10 + b * 10; j++){
                                        for (let k = z + c * 10; k < z + 10 + c * 10; k++){
                                            drawBlockColor(i, j, k, resp)
                                        }
                                    }
                                }
                                redrawObjects();
                            }
                        })
                    }
                }
            }
        }
    }
    drawChunkBoundsXHR = setTimeout(function(){
        drawChunkBounds(thisChunkPosition)
    }, 1000)
}

// Disabled because of lack of functionality and performance
// drawChunkBounds(undefined)
