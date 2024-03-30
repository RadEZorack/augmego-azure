import * as THREE from '../three/three.module.js';
import { gameObjects, redrawObjects } from "./redrawObjects.js";
import { drawBlockColor } from "./drawBlock.js";
import { playerWrapper } from '../main/player.js';

const errorMargin = 0.1

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
        
        // console.log(chunkPosition, thisChunkPosition)
        if (chunkPosition == undefined || chunkPosition.x != x || chunkPosition.y != y || chunkPosition.z != z){ 
            
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
                    // console.log(resp);
                    // returns { plane: plane, cssObject: cssObject, scale: s }
                    for (let i = x; i < x + 10; i++){
                        for (let j = y; j < y + 10; j++){
                            for (let k = z; k < z + 10; k++){
                                drawBlockColor(i, j, k, resp)
                            }
                        }
                    }
                    redrawObjects();
                }
            })
        }
    }
    setTimeout(function(){
        drawChunkBounds(thisChunkPosition)
    }, 1000)
}

// Disabled because of lack of functionality and performance
// drawChunkBounds(undefined)
