import { gameObjects } from "./redrawObjects.js";
import { drawBlock } from "./drawBlock.js";
import { perlin2 } from '../main/perlin.js';

function blockSides(x,y,z){
    return [
        `block:${x},${y},${z}:0:bottom:0`,
        `block:${x},${y},${z}:0:bottom:1`,
        `block:${x},${y},${z}:0:top:0`,
        `block:${x},${y},${z}:0:top:1`,
        `block:${x},${y},${z}:0:north:0`,
        `block:${x},${y},${z}:0:north:1`,
        `block:${x},${y},${z}:0:south:0`,
        `block:${x},${y},${z}:0:south:1`,
        `block:${x},${y},${z}:0:east:0`,
        `block:${x},${y},${z}:0:east:1`,
        `block:${x},${y},${z}:0:west:0`,
        `block:${x},${y},${z}:0:west:1`,
    ]
}

export function removeBlock(x, y, z) {
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);

    // if (`blockVisibility:${x},${y},${z}` in gameObjects){
        gameObjects[`blockVisibility:${x},${y},${z}`] = false;
    // }

    const sides = blockSides(x,y,z);

    for (let i = 0; i < sides.length; i++) {
        const side = sides[i]
        if (side in gameObjects){
            delete gameObjects[side];
        }
    }

    const sidesToAdd = [
        [x+1,y,z],
        [x-1,y,z],
        [x,y+1,z],
        [x,y-1,z],
        [x,y,z+1],
        [x,y,z-1],
    ]

    for (let i = 0; i < sidesToAdd.length; i++) {
        const xyz = sidesToAdd[i];

        if (`blockVisibility:${xyz[0]},${xyz[1]},${xyz[2]}` in gameObjects 
            && gameObjects[`blockVisibility:${xyz[0]},${xyz[1]},${xyz[2]}`].isRemoved == false){
                drawBlock(xyz[0], xyz[1], xyz[2], gameObjects[`blockVisibility:${xyz[0]},${xyz[1]},${xyz[2]}`].textureUrl)

        }else if (!(`blockVisibility:${xyz[0]},${xyz[1]},${xyz[2]}` in gameObjects)
            && (3*perlin2(xyz[0]/10,xyz[2]/10) >= xyz[1])){
                let textureUrl = favicon;
                if (perlin2(xyz[0]/5,xyz[2]/5) >= 0){
                    textureUrl = grassTexture;
                }else{
                    textureUrl = dirtTexture;
                }
                drawBlock(xyz[0], xyz[1], xyz[2], textureUrl);
        }
    }    
}