import { gameObjects } from "./redrawObjects";

export function drawBlock(x, y, z) {
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);

    // We check the TOP of the adjacent block
    if ((`block:${x},${y-1},${z}:0:top:0` in gameObjects) || (`block:${x},${y-1},${z}:0:top:1` in gameObjects)){
        // We have an adjancent block, hide it's face and don't draw the new face
        if (`block:${x},${y-1},${z}:0:top:0` in gameObjects){
            gameObjects[`block:${x},${y-1},${z}:0:top:0`].isHidden = true;
        }

        if (`block:${x},${y-1},${z}:0:top:1` in gameObjects){
            gameObjects[`block:${x},${y-1},${z}:0:top:1`].isHidden = true;
        }
        
    } else {
        // No adjancent block, draw the new BOTTOM face
        gameObjects[`block:${x},${y},${z}:0:bottom:0`] = {
            key: `block:${x},${y},${z}:0:bottom:0`,
            textureUrl: favicon,
            p1x: x,
            p1y: y,
            p1z: z,

            p2x: x,
            p2y: y,
            p2z: z+1,

            p3x: x+1,
            p3y: y,
            p3z: z,

            uv1x: 0.0,
            uv1y: 0.0,

            uv2x: 0.0,
            uv2y: 1.0,

            uv3x: 1.0,
            uv3y: 0.0,

            isHidden: false,
            // weightChance: Math.random(),
        };

        gameObjects[`block:${x},${y},${z}:0:bottom:1`] = {
            key: `block:${x},${y},${z}:0:bottom:1`,
            textureUrl: favicon,
            p1x: x,
            p1y: y,
            p1z: z+1,

            p2x: x+1,
            p2y: y,
            p2z: z+1,

            p3x: x+1,
            p3y: y,
            p3z: z,

            uv1x: 0.0,
            uv1y: 1.0,

            uv2x: 1.0,
            uv2y: 1.0,

            uv3x: 1.0,
            uv3y: 0.0,

            isHidden: false,
            // weightChance: Math.random(),
        };
    }

    // We check the BOTTOM of the adjacent block
    if ((`block:${x},${y+1},${z}:0:bottom:0` in gameObjects) || (`block:${x},${y+1},${z}:0:bottom:1` in gameObjects)){
        // We have an adjancent block, hide it's face and don't draw the new face
        if (`block:${x},${y+1},${z}:0:bottom:0` in gameObjects){
            gameObjects[`block:${x},${y+1},${z}:0:bottom:0`].isHidden = true;
        }

        if (`block:${x},${y+1},${z}:0:bottom:1` in gameObjects){
            gameObjects[`block:${x},${y+1},${z}:0:bottom:1`].isHidden = true;
        }

    } else {
        // No adjancent block, draw the new TOP face
        gameObjects[`block:${x},${y},${z}:0:top:0`] = {
            key: `block:${x},${y},${z}:0:top:0`,
            textureUrl: favicon,
            p1x: x,
            p1y: y+1,
            p1z: z,

            p2x: x+1,
            p2y: y+1,
            p2z: z,

            p3x: x,
            p3y: y+1,
            p3z: z+1,

            uv1x: 0.0,
            uv1y: 0.0,

            uv2x: 1.0,
            uv2y: 0.0,

            uv3x: 0.0,
            uv3y: 1.0,

            isHidden: false,
            // weightChance: Math.random(),
        };

        gameObjects[`block:${x},${y},${z}:0:top:1`] = {
            key: `block:${x},${y},${z}:0:top:1`,
            textureUrl: favicon,
            p1x: x+1,
            p1y: y+1,
            p1z: z,

            p2x: x+1,
            p2y: y+1,
            p2z: z+1,

            p3x: x,
            p3y: y+1,
            p3z: z+1,

            uv1x: 1.0,
            uv1y: 0.0,

            uv2x: 1.0,
            uv2y: 1.0,

            uv3x: 0.0,
            uv3y: 1.0,

            isHidden: false,
            // weightChance: Math.random(),
        };
    }

    // We check the NORTH of the adjacent block
    if ((`block:${x},${y},${z-1}:0:north:0` in gameObjects) || (`block:${x},${y},${z-1}:0:north:1` in gameObjects)){
        // We have an adjancent block, hide it's face and don't draw the new face
        if (`block:${x},${y},${z-1}:0:north:0` in gameObjects){
            gameObjects[`block:${x},${y},${z-1}:0:north:0`].isHidden = true;
        }

        if (`block:${x},${y},${z-1}:0:north:1` in gameObjects){
            gameObjects[`block:${x},${y},${z-1}:0:north:1`].isHidden = true;
        }

    } else {
        // No adjancent block, draw the new SOUTH face
        gameObjects[`block:${x},${y},${z}:0:south:0`] = {
            key: `block:${x},${y},${z}:0:south:0`,
            textureUrl: favicon,
            p1x: x,
            p1y: y,
            p1z: z,

            p2x: x+1,
            p2y: y,
            p2z: z,

            p3x: x,
            p3y: y+1,
            p3z: z,

            uv1x: 0.0,
            uv1y: 0.0,

            uv2x: 1.0,
            uv2y: 0.0,

            uv3x: 0.0,
            uv3y: 1.0,

            isHidden: false,
            // weightChance: Math.random(),
        };

        gameObjects[`block:${x},${y},${z}:0:south:1`] = {
            key: `block:${x},${y},${z}:0:south:1`,
            textureUrl: favicon,
            p1x: x+1,
            p1y: y,
            p1z: z,

            p2x: x+1,
            p2y: y+1,
            p2z: z,

            p3x: x,
            p3y: y+1,
            p3z: z,

            uv1x: 1.0,
            uv1y: 0.0,

            uv2x: 1.0,
            uv2y: 1.0,

            uv3x: 0.0,
            uv3y: 1.0,

            isHidden: false,
            // weightChance: Math.random(),
        };
    }

    // We check the SOUTH of the adjacent block
    if ((`block:${x},${y},${z+1}:0:south:0` in gameObjects) || (`block:${x},${y},${z+1}:0:south:1` in gameObjects)){
        // We have an adjancent block, hide it's face and don't draw the new face
        if (`block:${x},${y},${z+1}:0:south:0` in gameObjects){
            gameObjects[`block:${x},${y},${z+1}:0:south:0`].isHidden = true;
        }

        if (`block:${x},${y},${z+1}:0:south:1` in gameObjects){
            gameObjects[`block:${x},${y},${z+1}:0:south:1`].isHidden = true;
        }
    } else {
        gameObjects[`block:${x},${y},${z}:0:north:0`] = {
            key: `block:${x},${y},${z}:0:north:0`,
            textureUrl: favicon,
            p1x: x+1,
            p1y: y,
            p1z: z+1,

            p2x: x,
            p2y: y,
            p2z: z+1,

            p3x: x,
            p3y: y+1,
            p3z: z+1,

            uv1x: 1.0,
            uv1y: 0.0,

            uv2x: 0.0,
            uv2y: 0.0,

            uv3x: 0.0,
            uv3y: 1.0,
            
            isHidden: false,
            // weightChance: Math.random(),
        };

        gameObjects[`block:${x},${y},${z}:0:north:1`] ={
            key: `block:${x},${y},${z}:0:north:1`,
            textureUrl: favicon,
            p1x: x+1,
            p1y: y+1,
            p1z: z+1,

            p2x: x+1,
            p2y: y,
            p2z: z+1,

            p3x: x,
            p3y: y+1,
            p3z: z+1,

            uv1x: 1.0,
            uv1y: 1.0,

            uv2x: 1.0,
            uv2y: 0.0,

            uv3x: 0.0,
            uv3y: 1.0,

            isHidden: false, 
            // weightChance: Math.random(),
        };
    }

    // We check the WEST of the adjacent block
    if ((`block:${x+1},${y},${z}:0:west:0` in gameObjects) || (`block:${x+1},${y},${z}:0:west:1` in gameObjects)){
        // We have an adjancent block, hide it's face and don't draw the new face
        if (`block:${x+1},${y},${z}:0:west:0` in gameObjects){
            gameObjects[`block:${x+1},${y},${z}:0:west:0`].isHidden = true;
        }

        if (`block:${x+1},${y},${z}:0:west:1` in gameObjects){
            gameObjects[`block:${x+1},${y},${z}:0:west:1`].isHidden = true;
        }
    } else {

        gameObjects[`block:${x},${y},${z}:0:east:0`] ={
            key: `block:${x},${y},${z}:0:east:0`,
            textureUrl: favicon,
            p1x: x,
            p1y: y,
            p1z: z,

            p2x: x,
            p2y: y+1,
            p2z: z,

            p3x: x,
            p3y: y,
            p3z: z+1,

            uv1x: 0.0,
            uv1y: 0.0,

            uv2x: 0.0,
            uv2y: 1.0,

            uv3x: 1.0,
            uv3y: 0.0,

            isHidden: false,
            // weightChance: Math.random(),
        };

        gameObjects[`block:${x},${y},${z}:0:east:1`] = {
            key: `block:${x},${y},${z}:0:east:1`,
            textureUrl: favicon,
            p1x: x,
            p1y: y+1,
            p1z: z+1,

            p2x: x,
            p2y: y,
            p2z: z+1,

            p3x: x,
            p3y: y+1,
            p3z: z,

            uv1x: 1.0,
            uv1y: 1.0,

            uv2x: 1.0,
            uv2y: 0.0,

            uv3x: 0.0,
            uv3y: 1.0,

            isHidden: false,
            // weightChance: Math.random(),
        };
    }

    // We check the EAST of the adjacent block
    if ((`block:${x-1},${y},${z}:0:east:0` in gameObjects) || (`block:${x-1},${y},${z}:0:east:1` in gameObjects)){
        // We have an adjancent block, hide it's face and don't draw the new face
        if (`block:${x-1},${y},${z}:0:east:0` in gameObjects){
            gameObjects[`block:${x-1},${y},${z}:0:east:0`].isHidden = true;
        }

        if (`block:${x-1},${y},${z}:0:east:1` in gameObjects){
            gameObjects[`block:${x-1},${y},${z}:0:east:1`].isHidden = true;
        }
    } else {
        gameObjects[`block:${x},${y},${z}:0:west:0`] = {
            key: `block:${x},${y},${z}:0:west:0`,
            textureUrl: favicon,
            p1x: x+1,
            p1y: y,
            p1z: z,

            p2x: x+1,
            p2y: y,
            p2z: z+1,

            p3x: x+1,
            p3y: y+1,
            p3z: z,

            uv1x: 0.0,
            uv1y: 0.0,

            uv2x: 1.0,
            uv2y: 0.0,

            uv3x: 0.0,
            uv3y: 1.0,

            isHidden: false,
            // weightChance: Math.random(),
        };

        gameObjects[`block:${x},${y},${z}:0:west:1`] = {
            key: `block:${x},${y},${z}:0:west:1`,
            textureUrl: favicon,
            p1x: x+1,
            p1y: y+1,
            p1z: z+1,

            p2x: x+1,
            p2y: y+1,
            p2z: z,

            p3x: x+1,
            p3y: y,
            p3z: z+1,

            uv1x: 1.0,
            uv1y: 1.0,

            uv2x: 0.0,
            uv2y: 1.0,

            uv3x: 1.0,
            uv3y: 0.0,

            isHidden: false,
            // weightChance: Math.random(),
        };
    }
}