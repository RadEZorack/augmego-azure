import { gameObjects } from "./redrawObjects.js";

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

    const sides = blockSides(x,y,z);

    for (let i = 0; i < sides.length; i++) {
        const side = sides[i]
        if (side in gameObjects){
            delete gameObjects[side];
        }
    }
}