import * as THREE from '../three/three.module.min.js';
import { gameObjects, redrawObjects, initGameObjects } from "./redrawObjects.js";
import { drawBlock, chunkGameObjects } from "./drawBlock.js";
import { removeBlock } from "./removeBlock.js";
import { perlin2, simplex2 } from '../main/perlin.js';
import { loadPlayer, playerWrapper } from '../main/player.js';

const CHUNK_SIZE = 50

export function initObjects() {
    console.log("initObjects");
    
    let thisPosition = new THREE.Vector3(0,0,0)
    if (!(playerWrapper === undefined)){
      thisPosition.x = playerWrapper.position.x
      thisPosition.y = playerWrapper.position.y
      thisPosition.z = playerWrapper.position.z
    }
    
    // Round to nearest 50
    thisPosition.x = Math.floor(thisPosition.x/CHUNK_SIZE)*CHUNK_SIZE
    thisPosition.y = Math.floor(thisPosition.y/CHUNK_SIZE)*CHUNK_SIZE
    thisPosition.z = Math.floor(thisPosition.z/CHUNK_SIZE)*CHUNK_SIZE

    // let chunkKeysToRemove = []
    let chunkKeysToAdd = []

    for(let chunkX = -CHUNK_SIZE*2; chunkX <= CHUNK_SIZE*2; chunkX += CHUNK_SIZE){
      // for(let chunkY = 0; chunkY <= 0; chunkY += CHUNK_SIZE){
        let chunkY = 0;
        for(let chunkZ = -CHUNK_SIZE*2; chunkZ <= CHUNK_SIZE*2; chunkZ += CHUNK_SIZE){
          const chunkKey = `${chunkX+thisPosition.x},${chunkY+thisPosition.y},${chunkZ+thisPosition.z}`

          // const distance = Math.sqrt(chunkX*chunkX + chunkY*chunkY + chunkZ*chunkZ)
          // if(distance >= 3*CHUNK_SIZE/2){
          //   if (chunkKey in chunkGameObjects){
          //     chunkGameObjects[chunkKey].forEach(function(key) {
          //       delete gameObjects[key]
          //     });
          //   }
          //   continue
          // }
          
          // if (!(chunkKey in chunkGameObjects)){
            chunkKeysToAdd.push([chunkX,chunkY,chunkZ])
            // chunkKeysToAdd.push([chunkX+thisPosition.x,chunkY+thisPosition.y,chunkZ+thisPosition.z])
          // }
        }
      // }
    }

    // const chunkKey = `${thisPosition.x},${thisPosition.y},${thisPosition.z}`
    
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
    // let seed = 1;
    function random(seed) {
      // Seed is x + 2 * initRange *z
      const x = Math.sin(seed * 10000) * 10000;
      return x - Math.floor(x);
    }

    // const initRange = 100;

    // This wipes the entire gameobjects dict... we're smarter than that ;)
    // TODO: delete old chunk blocks
    // initGameObjects();
  
    // noise.seed(0)
    let redrawCount = 0;
    // for(let chunkX = -50; chunkX <= 50; chunkX += 50){
    //   for(let chunkZ = -50; chunkZ <= 50; chunkZ += 50){
    chunkKeysToAdd.forEach((key) => {
      const chunkX = key[0]
      const chunkY = key[1]
      const chunkZ = key[2]
      for (let x = chunkX + thisPosition.x; x < chunkX + thisPosition.x + CHUNK_SIZE; x++) {
        // for (let y = chunkY + thisPosition.y; y < chunkY + thisPosition.y + CHUNK_SIZE; y++) {
          let y=0;
          for (let z = chunkZ + thisPosition.z; z < chunkZ + thisPosition.z + CHUNK_SIZE; z++) {
            if (y < 0){
              drawBlock(x, y, z, dirtTexture)
              continue;
            }
            const innerSeed = x + 200 * z
            // Grass or dirt
              //   let id = Math.floor(17 * Math.random());
              let textureUrl = favicon;
              // Draw the bounds of purchase area
              // if(((x % 20) == 0 || (x % 20) == 19 || (x % 20) == -1 || (x % 20) == -0) ||
              //    ((z % 20) == 0 || (z % 20) == 19 || (z % 20) == -1 || (z % 20) == -0)){
              if(//X
                (x % 20) == 0 || (x % 20) == 6 || (x % 20) == 0 || (x % 20) == -14 ||
                //Z
                (z % 20) == 0 || (z % 20) == 6 || (z % 20) == 0 || (z % 20) == -14
              ){
                if(// X
                //  (x % 20) == 3 ||
                (x % 20) == 1 || (x % 20) == -19 ||
                (x % 20) == 2 || (x % 20) == -18 ||
                (x % 20) == 3 || (x % 20) == -17 ||
                (x % 20) == 4 || (x % 20) == -16 ||
                (x % 20) == 5 || (x % 20) == -15 ||
                //  (x % 20) == 6 || (x % 20) == -14 ||
                // Z
                //  (z % 20) == 3 ||
                (z % 20) == 1 || (z % 20) == -19 ||
                (z % 20) == 2 || (z % 20) == -18 ||
                (z % 20) == 3 || (z % 20) == -17 ||
                (z % 20) == 4 || (z % 20) == -16 ||
                (z % 20) == 5 || (z % 20) == -15 
                //  (z % 20) == 6 || (z % 20) == -14
                ){
                  drawBlock(x, 0, z, whiteGravelTexture)
                }else{
                  drawBlock(x, 0, z, concreteTexture)
                }
              }else if((x % 20) == 3 || (x % 20) == -17 || (z % 20) == 3 || (z % 20) == -17){
                if(//X
                (x % 20) == 1 || (x % 20) == -19 ||
                (x % 20) == 2 || (x % 20) == -18 ||
                (x % 20) == 4 || (x % 20) == -16 ||
                (x % 20) == 5 || (x % 20) == -15 ||
                // Z
                (z % 20) == 1 || (z % 20) == -19 ||
                (z % 20) == 2 || (z % 20) == -18 ||
                (z % 20) == 4 || (z % 20) == -16 ||
                (z % 20) == 5 || (z % 20) == -15 ||
                // X and Z
                (((x % 20) == 3 || (x % 20) == -17) && ((z % 20) == 3 || (z % 20) == -17))
                ){
                  drawBlock(x, 0, z, blackGravelTexture)
                }else{
                  drawBlock(x, 0, z, yellowGravelTexture)
                }
              }else if(
                // X
                (x % 20) == 1 || (x % 20) == -19 ||
                (x % 20) == 2 || (x % 20) == -18 ||
                (x % 20) == 4 || (x % 20) == -16 ||
                (x % 20) == 5 || (x % 20) == -15 ||
                // Z
                (z % 20) == 1 || (z % 20) == -19 ||
                (z % 20) == 2 || (z % 20) == -18 ||
                (z % 20) == 4 || (z % 20) == -16 ||
                (z % 20) == 5 || (z % 20) == -15
                ){
                drawBlock(x, 0, z, blackGravelTexture)
              // }else if((x % 20) == 3 || (x % 20) == -3 || (x % 20) == 17 || (x % 20) == -17 ||
              //     (z % 20) == 3 || (z % 20) == -3 || (z % 20) == 17 || (z % 20) == -17
              //   ){
                
              }else{
                if (perlin2(x/5,z/5) >= 0){
                  drawBlock(x, 0, z, grassTexture)
                  drawBlock(x, 1, z, grassTexture)
                  // drawBlock(x, 3*perlin2(x/10,z/10), z, textureUrl)
                }else{
                  drawBlock(x, 0, z, dirtTexture)
                  drawBlock(x, 1, z, dirtTexture)
                  // drawBlock(x, 3*perlin2(x/10,z/10), z, textureUrl)
                }

                if (Math.sqrt(x**2+z**2) > 20 && perlin2(x/5,z/5) < 0 && random(innerSeed) > 0.95){
                  // Trees
                  const ymin = 1
                  // const ymin = 3*perlin2(x/10,z/10)
                  const ymax = (simplex2(x,z)+1)*4 + 1
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
          min_x: chunkX,// + thisPosition.x,
          min_y: chunkY,// + thisPosition.y,
          min_z: chunkZ,// + thisPosition.z,
          max_x: chunkX+CHUNK_SIZE,// + thisPosition.x+CHUNK_SIZE,
          max_y: chunkY+CHUNK_SIZE,// + thisPosition.y+CHUNK_SIZE,
          max_z: chunkZ+CHUNK_SIZE,// + thisPosition.z+CHUNK_SIZE,
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
            redrawCount += 1;
            if (redrawCount == chunkKeysToAdd.length){
              redrawObjects();
            }
        }
      })
    })
  

    // redrawObjects();
    
}

let lastPlayerPosition = new THREE.Vector3(0,0,0);
function checkPlayerMovedPosition(){
  if (!(playerWrapper == undefined)){
    // console.log(lastPlayerPosition)
    // console.log(playerWrapper.position)
    const dist = Math.sqrt(
                    Math.pow(playerWrapper.position.x - lastPlayerPosition.x, 2) +
                    Math.pow(playerWrapper.position.y - lastPlayerPosition.y, 2) +
                    Math.pow(playerWrapper.position.z - lastPlayerPosition.z, 2)
                  )
    if (dist >= CHUNK_SIZE/4){
      lastPlayerPosition.x = playerWrapper.position.x
      lastPlayerPosition.y = playerWrapper.position.y
      lastPlayerPosition.z = playerWrapper.position.z
      initObjects();
    }
  }
  setTimeout(checkPlayerMovedPosition, 1000 )
}

loadPlayer();
// checkPlayerMovedPosition();