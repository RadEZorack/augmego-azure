import * as THREE from '../three/three.module.min.js';
import { gameObjects, redrawObjects } from "./redrawObjects.js";
import { drawBlockColor } from "./drawBlock.js";
import { playerWrapper } from '../main/player.js';
import { objectScene } from '../main/main.js';

const errorMargin = 0.1

let drawChunkBoundsXHR = undefined;
let chunkFrames = [];

export function drawChunkBounds(toggleLandClaimView){
    // console.log("this length", chunkFrames.length)
    for (let i = 0; i < chunkFrames.length; i++){
        let thisQuad = chunkFrames[i];
        objectScene.remove(thisQuad);
    }
    chunkFrames = []
    // console.log("this length after", chunkFrames.length)

    if (toggleLandClaimView == false){
        return
    }

    // console.log(playerWrapper);
    if (playerWrapper == undefined){
        drawChunkBoundsXHR = setTimeout(function(){
            drawChunkBounds()
        }, 1000)
    }else{
        const thisChunkPosition = new THREE.Vector3(
            Math.floor(playerWrapper.position.x/10)*10, // We dont really need to do this rounding now
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
                x: x,
                y: y,
                z: z
                // x: Math.floor(x/10),
                // y: Math.floor(y/10),
                // z: Math.floor(z/10)
            },
            success: function(resp) {
                console.log(resp);
                // returns { plane: plane, cssObject: cssObject, scale: s }
                // console.log(Object.keys(resp).length)
                for (let chunkKey in resp){
                    // console.log(chunkKey)
                    let chunkKeySplit = chunkKey.split(":")
                    chunkKeySplit = chunkKeySplit[1].split(",")
                    const xChunk = Number.parseInt(chunkKeySplit[0])
                    const xChunk2 = Number.parseInt(chunkKeySplit[1])
                    // const yChunk = Number.parseInt(chunkKeySplit[1].split("=")[1])
                    const zChunk = Number.parseInt(chunkKeySplit[4])
                    const zChunk2 = Number.parseInt(chunkKeySplit[5])

                    let color = resp[chunkKey];
                    if (color == "red"){
                        color = new THREE.Color(1, 0, 0)
                    }else if (color == "green"){
                        color = new THREE.Color(0, 1, 0)
                    }else if (color == "blue"){
                        color = new THREE.Color(0, 0, 1)
                    }

                    const quadMaterial = new THREE.MeshBasicMaterial({
                        color: color,
                        wireframe: true
                        // transparent: true,
                        // opacity: 0                    
                    });
        
                    const quadGeometry = new THREE.PlaneGeometry(xChunk2-xChunk-0.1, zChunk2-zChunk-0.1);
        
                    const quadMesh = new THREE.Mesh(quadGeometry, quadMaterial);
                    quadMesh.position.set((xChunk+xChunk2)/2,100,(zChunk+zChunk2)/2); // Set position
                    quadMesh.rotation.set(-Math.PI/2,0,0); // Set rotation
        
                    objectScene.add(quadMesh);
                    chunkFrames.push(quadMesh);

                    // for (let i = xChunk * 10; i < 10 + xChunk * 10; i++){
                    //     // TODO we probably want chunks going to the sky and bedrock
                    //     for (let j = -100; j < 100; j++){
                    //         for (let k = zChunk * 10; k < 10 + zChunk * 10; k++){
                    //             if(toggleLandClaimView == true){
                    //                 // add color
                    //                drawBlockColor(i, j, k, resp[chunkKey])
                    //             }else{
                    //                 // remove color
                    //                 drawBlockColor(i, j, k, "")
                    //             }
                                
                    //         }
                    //     }
                    // }
                }
                // redrawObjects();
            }
        })
    }
    
}

export function buyLand(position){
    const thisChunkPosition = new THREE.Vector3(
        Math.floor(position.x/10)*10,
        Math.floor(position.y/10)*10,
        Math.floor(position.z/10)*10
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
            drawChunkBounds(true);
            $("#generalToast .toast-body").html("You have purchased this chunk of land.");
            $("#generalToast").toast("show");
        },
        error: function (request, status, error) {
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    })
}
