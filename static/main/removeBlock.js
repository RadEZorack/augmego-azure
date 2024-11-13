import { gameObjects } from "./redrawObjects.js";
import { drawBlock } from "./drawBlock.js";
import { perlin2 } from '../main/perlin.js';

function blockSides(x,y,z){
    return [
        `block:${x},${y},${z}:bottom`,
        `block:${x},${y},${z}:top`,
        `block:${x},${y},${z}:north`,
        `block:${x},${y},${z}:south`,
        `block:${x},${y},${z}:east`,
        `block:${x},${y},${z}:west`,
    ]
}

export function removeBlock(x, y, z) {
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);

    gameObjects[`blockVisibility:${x},${y},${z}`] = "";

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
            && gameObjects[`blockVisibility:${xyz[0]},${xyz[1]},${xyz[2]}`] != ""){
                drawBlock(xyz[0], xyz[1], xyz[2], gameObjects[`blockVisibility:${xyz[0]},${xyz[1]},${xyz[2]}`])

        }else if (
            !(`blockVisibility:${xyz[0]},${xyz[1]},${xyz[2]}` in gameObjects) &&
            (3*perlin2(xyz[0]/10,xyz[2]/10) >= xyz[1]) &&
            xyz[1] <= 0
        ){
                let textureUrl = "Grass";
                if (perlin2(xyz[0]/5,xyz[2]/5) >= 0){
                    textureUrl = "Grass";
                }else{
                    textureUrl = "Dirt";
                }
                drawBlock(xyz[0], xyz[1], xyz[2], textureUrl);
        }else{
            drawBlock(xyz[0], xyz[1], xyz[2], "");
        }
    }    
}