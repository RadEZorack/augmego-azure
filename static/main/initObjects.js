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
      // console.log("hit")
      thisPosition.x = playerWrapper.position.x
      thisPosition.y = playerWrapper.position.y
      thisPosition.z = playerWrapper.position.z
    }else{
      setTimeout(initObjects, 1000 )
      return
    }
    // console.log(thisPosition)
    
    // Round to nearest 50
    thisPosition.x = Math.floor(thisPosition.x/CHUNK_SIZE)*CHUNK_SIZE
    thisPosition.y = Math.floor(thisPosition.y/CHUNK_SIZE)*CHUNK_SIZE
    thisPosition.z = Math.floor(thisPosition.z/CHUNK_SIZE)*CHUNK_SIZE

    // let chunkKeysToRemove = []
    let chunkKeysToAdd = []
    let chunkKeysToFetch = []
0
    for(let chunkX = -CHUNK_SIZE*5 + thisPosition.x; chunkX <= CHUNK_SIZE*5 + thisPosition.x; chunkX += CHUNK_SIZE){
      for(let chunkY = -CHUNK_SIZE + thisPosition.y; chunkY <= CHUNK_SIZE*3 + thisPosition.y; chunkY += CHUNK_SIZE){
        // let chunkY = 0;
        for(let chunkZ = -CHUNK_SIZE*5 + thisPosition.z; chunkZ <= CHUNK_SIZE*5 + thisPosition.z; chunkZ += CHUNK_SIZE){
          const chunkKey = `${chunkX},${chunkY},${chunkZ}`

          const distance = Math.sqrt(Math.pow(chunkX-thisPosition.x,2)+Math.pow(chunkY-thisPosition.y,2)+Math.pow(chunkZ-thisPosition.z,2))
          // console.log(distance, chunkX, thisPosition.x, thisPosition.z);
          if(distance >= 3*CHUNK_SIZE){
            // console.log("eraser")
            if (chunkKey in chunkGameObjects){
              chunkGameObjects[chunkKey].forEach(function(key) {
                // console.log(key)
                delete gameObjects[key]
              });
              delete chunkGameObjects[chunkKey]
            }
            
          }else if (distance < 3*CHUNK_SIZE && !(chunkKey in chunkGameObjects)){
            chunkKeysToAdd.push([chunkX,chunkY,chunkZ])
            chunkKeysToFetch.push(`${chunkX},${chunkX+CHUNK_SIZE},${chunkY},${chunkY+CHUNK_SIZE},${chunkZ},${chunkZ+CHUNK_SIZE}`)
          }
        }
      }
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
      for (let x = chunkX; x < chunkX + CHUNK_SIZE; x++) {
        // for (let y = chunkY + thisPosition.y; y < chunkY + thisPosition.y + CHUNK_SIZE; y++) {
          let y=0;
          for (let z = chunkZ; z < chunkZ + CHUNK_SIZE; z++) {
            
            
            // if (y < 0){
            //   drawBlock(x, y, z, dirtTexture)
            //   continue;
            // }
            
            const innerSeed = x + 200 * z
            // Grass or dirt
              //   let id = Math.floor(17 * Math.random());
              // let textureUrl = favicon;
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
                  drawBlock(x-3, 0, z-3, "White Gravel")
                }else{
                  drawBlock(x-3, 0, z-3, "Concrete")
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
                  drawBlock(x-3, 0, z-3, "Black Gravel")
                }else{
                  drawBlock(x-3, 0, z-3, "Yellow Gravel")
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
                drawBlock(x-3, 0, z-3, "Black Gravel")
              // }else if((x % 20) == 3 || (x % 20) == -3 || (x % 20) == 17 || (x % 20) == -17 ||
              //     (z % 20) == 3 || (z % 20) == -3 || (z % 20) == 17 || (z % 20) == -17
              //   ){
                
              }else{
                if (perlin2(x/5,z/5) >= 0){
                  drawBlock(x-3, 0, z-3, "Grass")
                  drawBlock(x-3, 1, z-3, "Grass")
                  // drawBlock(x, 3*perlin2(x/10,z/10), z, textureUrl)
                }else{
                  drawBlock(x-3, 0, z-3, "Dirt")
                  drawBlock(x-3, 1, z-3, "Dirt")
                  // drawBlock(x, 3*perlin2(x/10,z/10), z, textureUrl)
                }

                if (Math.sqrt(x**2+z**2) > 20 && perlin2(x/5,z/5) < 0 && random(innerSeed) > 0.95){
                  // Trees
                  const ymin = 1
                  // const ymin = 3*perlin2(x/10,z/10)
                  const ymax = (simplex2(x,z)+1)*4 + 1
                  for (let y2 = 0; y2 < ymax; y2++) {
                    drawBlock(x-3, ymin+y2, z-3, "Bark")
                  }
                  //leaves
                  drawBlock(x-3, ymin+ymax, z-3, "Pine Tree Leaves")
                  drawBlock(x+1-3, ymin+ymax, z-3, "Pine Tree Leaves")
                  drawBlock(x-1-3, ymin+ymax, z-3, "Pine Tree Leaves")
                  drawBlock(x-3, ymin+ymax, z+1-3, "Pine Tree Leaves")
                  drawBlock(x+1-3, ymin+ymax, z+1-3, "Pine Tree Leaves")
                  drawBlock(x-1-3, ymin+ymax, z+1-3, "Pine Tree Leaves")
                  drawBlock(x-3, ymin+ymax, z-1-3, "Pine Tree Leaves")
                  drawBlock(x+1-3, ymin+ymax, z-1-3, "Pine Tree Leaves")
                  drawBlock(x-1-3, ymin+ymax, z-1-3, "Pine Tree Leaves")

                  drawBlock(x-3, ymin+ymax+1, z-3, "Pine Tree Leaves")
                  drawBlock(x+1-3, ymin+ymax+1, z-3, "Pine Tree Leaves")
                  drawBlock(x-1-3, ymin+ymax+1, z-3, "Pine Tree Leaves")
                  drawBlock(x-3, ymin+ymax+1, z+1-3, "Pine Tree Leaves")
                  drawBlock(x-3, ymin+ymax+1, z-1-3, "Pine Tree Leaves")

                  drawBlock(x-3, ymin+ymax+2, z-3, "Pine Tree Leaves")
                }
              }
          }
        // }
      }
      // drawBlock(0,0,0, grassTexture)
      // drawBlock(1,0,0, grassTexture)
      // drawBlock(0,0,1, dirtTexture)
    })

      $.ajax({
        url: cubeLoadURL,
        type: 'GET',
        data: {
          csrfmiddlewaretoken: csrfmiddlewaretoken,
          ranges: chunkKeysToFetch.join("_")
          // min_x: chunkX,// + thisPosition.x,
          // min_y: chunkY,// + thisPosition.y,
          // min_z: chunkZ,// + thisPosition.z,
          // max_x: chunkX+CHUNK_SIZE,// + thisPosition.x+CHUNK_SIZE,
          // max_y: chunkY+CHUNK_SIZE,// + thisPosition.y+CHUNK_SIZE,
          // max_z: chunkZ+CHUNK_SIZE,// + thisPosition.z+CHUNK_SIZE,
        },
        success: function(resp) {
            console.log("success get");
            for(let i = 0; i < resp.length; i++){
              const data = resp[i];
              if (data.texture_name == ""){
                removeBlock(data.x, data.y, data.z);
              } else {
                drawBlock(data.x, data.y, data.z, data.texture_name);
              }
            }
            // redrawCount += 1;
            // if (redrawCount == chunkKeysToAdd.length){
              redrawObjects();
            // }
        }
      })
    
  

    // redrawObjects();
    
}

// initObjects();

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
    if (dist >= CHUNK_SIZE/2){
      lastPlayerPosition.x = playerWrapper.position.x
      lastPlayerPosition.y = playerWrapper.position.y
      lastPlayerPosition.z = playerWrapper.position.z
      initObjects();
    }
  }
  setTimeout(checkPlayerMovedPosition, 1000 )
}

loadPlayer();
checkPlayerMovedPosition();