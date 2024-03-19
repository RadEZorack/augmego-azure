import * as THREE from '../three/three.module.js';
import { create3dPage } from '../main/webpage3d.js';

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

$.ajax({
    url: chunkInfoURL,
    type: 'GET',
    data: {
        csrfmiddlewaretoken: csrfmiddlewaretoken,
        x: 0,
        y: 0,
        z: 0
      },
    success: function(resp) {
        console.log(resp);
        create3dPage(
            1000,
            10000,
            0.001,
            new THREE.Vector3(0+4.5, 0+4.5, 0-0.5),
            new THREE.Vector3(0, 0, 0),
            "",
            '<div style="width: 100%; height: 100%; background: '+resp+'">',
            ""
        )
        create3dPage(
            10000,
            1000,
            0.001,
            new THREE.Vector3(0+4.5, 0+4.5, 0-0.5),
            new THREE.Vector3(0, 0, 0),
            "",
            '<div style="width: 100%; height: 100%; background: '+resp+'">',
            ""
        )
        create3dPage(
            1000,
            10000,
            0.001,
            new THREE.Vector3(0+4.5, 0+4.5, 0+10-0.5),
            new THREE.Vector3(0, 0, 0),
            "",
            '<div style="width: 100%; height: 100%; background: '+resp+'">',
            ""
        )
        create3dPage(
            10000,
            1000,
            0.001,
            new THREE.Vector3(0+4.5, 0+4.5, 0+10-0.5),
            new THREE.Vector3(0, 0, 0),
            "",
            '<div style="width: 100%; height: 100%; background: '+resp+'">',
            ""
        )
        create3dPage(
            1000,
            10000,
            0.001,
            new THREE.Vector3(0+10-0.5, 0+4.5, 0+4.5),
            new THREE.Vector3(0, Math.PI/2, 0),
            "",
            '<div style="width: 100%; height: 100%; background: '+resp+'">',
            ""
        )
        create3dPage(
            10000,
            1000,
            0.001,
            new THREE.Vector3(0+10-0.5, 0+4.5, 0+4.5),
            new THREE.Vector3(0, Math.PI/2, 0),
            "",
            '<div style="width: 100%; height: 100%; background: '+resp+'">',
            ""
        )
        create3dPage(
            1000,
            10000,
            0.001,
            new THREE.Vector3(0-0.5, 0+4.5, 0+4.5),
            new THREE.Vector3(0, Math.PI/2, 0),
            "",
            '<div style="width: 100%; height: 100%; background: '+resp+'">',
            ""
        )
        create3dPage(
            10000,
            1000,
            0.001,
            new THREE.Vector3(0-0.5, 0+4.5, 0+4.5),
            new THREE.Vector3(0, Math.PI/2, 0),
            "",
            '<div style="width: 100%; height: 100%; background: '+resp+'">',
            ""
        )
    }
})