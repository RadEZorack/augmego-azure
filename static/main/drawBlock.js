import { gameObjects, redrawObjects } from "./redrawObjects.js";

export function drawBlock(x, y, z, textureUrl) {
    // console.log(textureUrl)
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);

    // Defines if the gameobject exists even if it's hidden. This could probably be added in the the other keys.
    gameObjects[`blockVisibility:${x},${y},${z}`] = textureUrl;
    
    if (textureUrl == "") {
        // If there is no texture, we don't want to draw or remove anything adjacent.
        return null;
    }

    // We check the TOP of the adjacent block
    if (`block:${x},${y-1},${z}:top` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x},${y-1},${z}:top`]
        
    } else {
        // No adjancent block, draw the new BOTTOM face
        gameObjects[`block:${x},${y},${z}:bottom`].textureUrl = textureUrl;
    }

    // We check the BOTTOM of the adjacent block
    if (`block:${x},${y+1},${z}:bottom` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x},${y+1},${z}:bottom`]

    } else {
        // No adjancent block, draw the new TOP face
        gameObjects[`block:${x},${y},${z}:top`].textureUrl = textureUrl;
    }

    // We check the NORTH of the adjacent block
    if (`block:${x},${y},${z-1}:north` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x},${y},${z-1}:north`]

    } else {
        // No adjancent block, draw the new SOUTH face
        gameObjects[`block:${x},${y},${z}:south`].textureUrl = textureUrl;
    }

    // We check the SOUTH of the adjacent block
    if (`block:${x},${y},${z+1}:south` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x},${y},${z+1}:south`]
        
    } else {
        gameObjects[`block:${x},${y},${z}:north`].textureUrl = textureUrl;
    }

    // We check the WEST of the adjacent block
    if (`block:${x-1},${y},${z}:west` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x-1},${y},${z}:west`]
        
    } else {
        gameObjects[`block:${x},${y},${z}:east`].textureUrl = textureUrl;
    }

    // We check the EAST of the adjacent block
    if (`block:${x+1},${y},${z}:east` in gameObjects){
        // We have an adjancent block, hide it's face and don't draw the new face
        delete gameObjects[`block:${x+1},${y},${z}:east`]
        
    } else {
        gameObjects[`block:${x},${y},${z}:west`].textureUrl = textureUrl;
    }
}

export function drawBlockColor(x,y,z,color){
    // console.log(textureUrl)
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);

    if (`block:${x},${y},${z}:bottom` in gameObjects){
        gameObjects[`block:${x},${y},${z}:bottom`].color = color;
    }
    if (`block:${x},${y},${z}:top` in gameObjects){
        gameObjects[`block:${x},${y},${z}:top`].color = color;
    }
    if (`block:${x},${y},${z}:north` in gameObjects){
        gameObjects[`block:${x},${y},${z}:north`].color = color;
    }
    if (`block:${x},${y},${z}:south` in gameObjects){
        gameObjects[`block:${x},${y},${z}:south`].color = color;
    }
    if (`block:${x},${y},${z}:east` in gameObjects){
        gameObjects[`block:${x},${y},${z}:east`].color = color;
    }
    if (`block:${x},${y},${z}:west` in gameObjects){
        gameObjects[`block:${x},${y},${z}:west`].color = color;
    }
}