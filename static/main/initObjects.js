import { gameObjects, redrawObjects } from "./redrawObjects.js";
import { drawBlock } from "./drawBlock.js";
import { removeBlock } from "./removeBlock.js";
import { perlin2 } from '../main/perlin.js';
import { loadPlayer } from '../main/player.js';

export function initObjects() {
    console.log("initObjects");
    // for (let i = 0; i < 256*16; i++){
    //   gameObjects.push({
    //     key: `initBlock:${i}`,
    //     lnglat: GEOPOS.projectionHigh.invert([(Math.random()-0.5)*256, (Math.random()-0.5)*256]),
    //     altitude: (Math.random()-0.5)*256,
    //     textureId: Math.floor(4 * Math.random()),
    //     colorPicker: colorPicker.pop(),
    //     rotationX: (Math.random()-0.5)*Math.PI,
    //     rotationY: (Math.random()-0.5)*Math.PI,
    //     rotationZ: (Math.random()-0.5)*Math.PI,
    //     weightChance: Math.random(),
    //   });
    // }
    let seed = 1;
    function random() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    const initRange = 100;
  
    // noise.seed(0)
    for (let x = -initRange; x < initRange; x++) {
      // for (let y = -1; y < 0; y++) {
        for (let z = -initRange; z < initRange; z++) {
          // Grass or dirt
            //   let id = Math.floor(17 * Math.random());
            let textureUrl = favicon;
            // Draw the bounds of purchase area
            // if(((x % 20) == 0 || (x % 20) == 19 || (x % 20) == -1 || (x % 20) == -0) ||
            //    ((z % 20) == 0 || (z % 20) == 19 || (z % 20) == -1 || (z % 20) == -0)){
            if(//X
              (x % 20) == 3 || (x % 20) == -3 || (x % 20) == 17 || (x % 20) == -17 ||
              //Z
              (z % 20) == 3 || (z % 20) == -3 || (z % 20) == 17 || (z % 20) == -17
            ){
              if(// X
               (x % 20) == 0 ||
               (x % 20) == 1 || (x % 20) == -1 || (x % 20) == 19 || (x % 20) == -19 ||
               (x % 20) == 2 || (x % 20) == -2 || (x % 20) == 18 || (x % 20) == -18 ||
               // Z
               (z % 20) == 0 ||
               (z % 20) == 1 || (z % 20) == -1 || (z % 20) == 19 || (z % 20) == -19 ||
               (z % 20) == 2 || (z % 20) == -2 || (z % 20) == 18 || (z % 20) == -18
              ){
                drawBlock(x, 1, z, whiteGravelTexture)
              }else{
                drawBlock(x, 1, z, concreteTexture)
              }
            }else if((x % 20) == 0 || (z % 20) == 0){
              if(//X
               (x % 20) == 1 || (x % 20) == -1 || (x % 20) == 19 || (x % 20) == -19 ||
               (x % 20) == 2 || (x % 20) == -2 || (x % 20) == 18 || (x % 20) == -18 ||
               // Z
               (z % 20) == 1 || (z % 20) == -1 || (z % 20) == 19 || (z % 20) == -19 ||
               (z % 20) == 2 || (z % 20) == -2 || (z % 20) == 18 || (z % 20) == -18 ||
               // X and Z
               (x % 20) == 0 && (z % 20) == 0
              ){
                drawBlock(x, 1, z, blackGravelTexture)
              }else{
                drawBlock(x, 1, z, yellowGravelTexture)
              }
            }else if(
               // X
               (x % 20) == 1 || (x % 20) == -1 || (x % 20) == 19 || (x % 20) == -19 ||
               (x % 20) == 2 || (x % 20) == -2 || (x % 20) == 18 || (x % 20) == -18 ||
               // Z
               (z % 20) == 1 || (z % 20) == -1 || (z % 20) == 19 || (z % 20) == -19 ||
               (z % 20) == 2 || (z % 20) == -2 || (z % 20) == 18 || (z % 20) == -18
              ){
              drawBlock(x, 1, z, blackGravelTexture)
            }else if((x % 20) == 3 || (x % 20) == -3 || (x % 20) == 17 || (x % 20) == -17 ||
                (z % 20) == 3 || (z % 20) == -3 || (z % 20) == 17 || (z % 20) == -17
              ){
              
            }else{
              if (perlin2(x/5,z/5) >= 0){
                drawBlock(x, 2, z, grassTexture)
                // drawBlock(x, 3*perlin2(x/10,z/10), z, textureUrl)
              }else{
                drawBlock(x, 2, z, dirtTexture)
                // drawBlock(x, 3*perlin2(x/10,z/10), z, textureUrl)
              }

              if (Math.sqrt(x**2+z**2) > 20 && perlin2(x/5,z/5) < 0 && random() > 0.95){
                // Trees
                const ymin = 2
                // const ymin = 3*perlin2(x/10,z/10)
                const ymax = random()*4+2
                for (let y2 = 0; y2 < ymax; y2++) {
                  drawBlock(x, ymin+y2, z, barkTexture)
                }
                //leaves
                drawBlock(x, ymin+ymax, z, pineTreeLeavesTexture)
                drawBlock(x+1, ymin+ymax, z, pineTreeLeavesTexture)
                drawBlock(x-1, ymin+ymax, z, pineTreeLeavesTexture)
                drawBlock(x, ymin+ymax, z+1, pineTreeLeavesTexture)
                drawBlock(x+1, ymin+ymax, z+1, pineTreeLeavesTexture)
                drawBlock(x-1, ymin+ymax, z+1, pineTreeLeavesTexture)
                drawBlock(x, ymin+ymax, z-1, pineTreeLeavesTexture)
                drawBlock(x+1, ymin+ymax, z-1, pineTreeLeavesTexture)
                drawBlock(x-1, ymin+ymax, z-1, pineTreeLeavesTexture)

                drawBlock(x, ymin+ymax+1, z, pineTreeLeavesTexture)
                drawBlock(x+1, ymin+ymax+1, z, pineTreeLeavesTexture)
                drawBlock(x-1, ymin+ymax+1, z, pineTreeLeavesTexture)
                drawBlock(x, ymin+ymax+1, z+1, pineTreeLeavesTexture)
                drawBlock(x, ymin+ymax+1, z-1, pineTreeLeavesTexture)

                drawBlock(x, ymin+ymax+2, z, pineTreeLeavesTexture)
              }
            }
        }
      // }
    }
    // drawBlock(0,0,0, grassTexture)
    // drawBlock(1,0,0, grassTexture)
    // drawBlock(0,0,1, dirtTexture)

    $.ajax({
      url: cubeLoadURL,
      type: 'GET',
      data: {
        csrfmiddlewaretoken: csrfmiddlewaretoken,
        min_x: -initRange,
        min_y: -initRange,
        min_z: -initRange,
        max_x: initRange,
        max_y: initRange,
        max_z: initRange,
      },
      success: function(resp) {
          console.log("success get");
          for(let i = 0; i < resp.length; i++){
            const data = resp[i];
            if (data.texture == null){
              removeBlock(data.x, data.y, data.z);
            } else {
              drawBlock(data.x, data.y, data.z, data.texture.image_url);
            }
          }

          redrawObjects();
          loadPlayer();
      }
    })

    redrawObjects();
}