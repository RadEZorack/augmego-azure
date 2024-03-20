import * as THREE from '../three/three.module.js';
import { create3dPage } from '../main/webpage3d.js';
import { playerWrapper } from '../main/player.js';

// Example
// create3dPage(
//     1200,
//     1200,
//     0.004,
//     new THREE.Vector3(3.5, 1.5, 5),
//     new THREE.Vector3(0, Math.PI, 0),
//     "https://localhost/people/donation-wall/",
//     ""
//   )

$.ajax({
    url: webPageLoadURL,
    type: 'GET',
    success: function(resp) {
        // console.log(resp);
        for(const i in resp){
            // console.log(resp[i]);
            const fields = resp[i]
            create3dPage(
                fields.w,
                fields.h,
                fields.s,
                new THREE.Vector3(fields.p1, fields.p2, fields.p3),
                new THREE.Vector3(fields.r1, fields.r2, fields.r3),
                fields.url,
                fields.html,
                fields.image
            )
        }
    }
})

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
                    console.log(resp);
                    // returns { plane: plane, cssObject: cssObject, scale: s }
                    create3dPage(
                        1000,
                        9000,
                        0.001,
                        new THREE.Vector3(x+4.5, y+4.5, z-0.5+errorMargin),
                        new THREE.Vector3(0, 0, 0),
                        "",
                        '<div style="width: 100%; height: 100%; background: '+resp+'">',
                        ""
                    )
                    create3dPage(
                        9000,
                        1000,
                        0.001,
                        new THREE.Vector3(x+4.5, y+4.5, z-0.5+errorMargin),
                        new THREE.Vector3(0, 0, 0),
                        "",
                        '<div style="width: 100%; height: 100%; background: '+resp+'">',
                        ""
                    )
                    create3dPage(
                        1000,
                        10000,
                        0.001,
                        new THREE.Vector3(x+4.5, y+4.5, z+10-0.5-errorMargin),
                        new THREE.Vector3(0, 0, 0),
                        "",
                        '<div style="width: 100%; height: 100%; background: '+resp+'">',
                        ""
                    )
                    create3dPage(
                        9000,
                        1000,
                        0.001,
                        new THREE.Vector3(x+4.5, y+4.5, z+10-0.5-errorMargin),
                        new THREE.Vector3(0, 0, 0),
                        "",
                        '<div style="width: 100%; height: 100%; background: '+resp+'">',
                        ""
                    )
                    create3dPage(
                        1000,
                        9000,
                        0.001,
                        new THREE.Vector3(x+10-0.5-errorMargin, y+4.5, z+4.5),
                        new THREE.Vector3(0, Math.PI/2, 0),
                        "",
                        '<div style="width: 100%; height: 100%; background: '+resp+'">',
                        ""
                    )
                    create3dPage(
                        9000,
                        1000,
                        0.001,
                        new THREE.Vector3(x+10-0.5-errorMargin, y+4.5, z+4.5),
                        new THREE.Vector3(0, Math.PI/2, 0),
                        "",
                        '<div style="width: 100%; height: 100%; background: '+resp+'">',
                        ""
                    )
                    create3dPage(
                        1000,
                        9000,
                        0.001,
                        new THREE.Vector3(x-0.5+errorMargin, y+4.5, z+4.5),
                        new THREE.Vector3(0, Math.PI/2, 0),
                        "",
                        '<div style="width: 100%; height: 100%; background: '+resp+'">',
                        ""
                    )
                    create3dPage(
                        9000,
                        1000,
                        0.001,
                        new THREE.Vector3(x-0.5+errorMargin, y+4.5, z+4.5),
                        new THREE.Vector3(0, Math.PI/2, 0),
                        "",
                        '<div style="width: 100%; height: 100%; background: '+resp+'">',
                        ""
                    )
                }
            })
        }
    }
    setTimeout(function(){
        drawChunkBounds(thisChunkPosition)
    }, 1000)
}

drawChunkBounds(undefined)
