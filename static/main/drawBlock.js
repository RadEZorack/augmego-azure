
function drawBlock(x, y, z){
    x = Math.floor(x);
    y = Math.floor(y);
    z = Math.floor(z);

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });

  gameObjects.push({
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
    weightChance: Math.random(),
  });
}