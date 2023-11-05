import * as THREE from '../three/three.module.js';
import { create3dPage } from '../main/webpage3d.js';

// Example
// create3dPage(
//     1200,
//     1200,
//     0.004,
//     new THREE.Vector3(3.5, 1.5, 5),
//     new THREE.Vector3(0, Math.PI, 0),
//     "https://courseware.cemc.uwaterloo.ca/",
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
                fields.h,
                fields.w,
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