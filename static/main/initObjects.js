import { gameObjects, redrawObjects } from "./redrawObjects.js";
import { drawBlock } from "./drawBlock.js";
import { removeBlock } from "./removeBlock.js";
import { perlin2 } from '../main/perlin.js';

function initObjects() {
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

    const initRange = 64;
  
    // noise.seed(0)
    for (let x = -initRange; x < initRange; x++) {
      // for (let y = -1; y < 0; y++) {
        for (let z = -initRange; z < initRange; z++) {
          // Grass or dirt
            //   let id = Math.floor(12 * Math.random());
            let textureUrl = favicon;
            if (perlin2(x/5,z/5) >= 0){
                textureUrl = grassTexture
            }else{
                textureUrl = dirtTexture
            }
    
            drawBlock(x, 3*perlin2(x/10,z/10), z, textureUrl)
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
      }
    })

    // redrawObjects();
}
  
initObjects();