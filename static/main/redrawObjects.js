import * as THREE from '../three/three.module.js';
import { objectScene } from '../main/main.js';
import { perlin2 } from '../main/perlin.js';
import { vs, fs } from '../main/shaders.js';

export let gameObjects = {};
export let triangleMeshInstanceIDKeys = {};
let drawInstances = 1000 * 1000;
let triangleMeshs = {};

function initObjectsForTesting() {
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

  // noise.seed(0)
  for (let x = -64; x < 64; x++) {
    for (let y = -1; y < 0; y++) {
      for (let z = -64; z < 64; z++) {
        // Grass or dirt
        let id = Math.floor(12 * Math.random());
        let textureUrl = favicon;
        if (perlin2(x/5,z/5) >= 0){
          textureUrl = grassTexture
        }else{
          textureUrl = dirtTexture
        }

        gameObjects.push({
          key: `initBlock:${x},${y},${z}:0`,
          textureUrl: textureUrl,
          p1x: x,
          p1y: 3*perlin2(x/10,z/10),
          p1z: z,

          p2x: x+1,
          p2y: 3*perlin2((x+1)/10,z/10),
          p2z: z,

          p3x: x,
          p3y: 3*perlin2(x/10,(z+1)/10),
          p3z: z+1,

          uv1x: 0.0,
          uv1y: 0.0,

          uv2x: 1.0,
          uv2y: 0.0,

          uv3x: 0.0,
          uv3y: 1.0,
          weightChance: Math.random(),
        });
        if (perlin2((x+1)/5,(z+1)/5) >= 0){
          textureUrl = grassTexture
        }else{
          textureUrl = dirtTexture
        }
        gameObjects.push({
          key: `initBlock:${x},${y},${z}:1`,
          textureUrl: textureUrl,

          p1x: x+1,
          p1y: 3*perlin2((x+1)/10,(z+1)/10),
          p1z: z+1,

          p3x: x+1,
          p3y: 3*perlin2((x+1)/10,z/10),
          p3z: z,

          p2x: x,
          p2y: 3*perlin2(x/10,(z+1)/10),
          p2z: z+1,

          uv1x: 1.0,
          uv1y: 1.0,

          uv3x: 1.0,
          uv3y: 0.0,

          uv2x: 0.0,
          uv2y: 1.0,

          weightChance: Math.random(),
        });
        if (Math.sqrt(x**2+z**2) > 15 && perlin2(x/5,z/5) < 0 && random() > 0.9){
          // Trees
          const ymin = 3*perlin2(x/10,z/10)
          const ymax = Math.random()*5+2
          for (let y2 = 0; y2 < ymax; y2++) {
            for (let t = 0; t < 2*Math.PI; t += Math.PI/8) {
              // Bark
              gameObjects.push({
                key: `initBlock:${x},${y2},${z},${t}:1`,
                textureUrl: barkTexture,

                p1x: x+Math.sin(t)/(y2+2),
                p1y: ymin + y2,
                p1z: z+Math.cos(t)/(y2+2),

                p3x: x+Math.sin(t+Math.PI/8)/(y2+2),
                p3y: ymin + y2,
                p3z: z+Math.cos(t+Math.PI/8)/(y2+2),

                p2x: x+Math.sin(t+Math.PI/8)/(y2+3),
                p2y: ymin + y2 +1,
                p2z: z+Math.cos(t+Math.PI/8)/(y2+3),

                uv1x: Math.sin(t/2),
                uv1y: 0.0,

                uv3x: Math.sin((t+Math.PI/8)/2),
                uv3y: 0.0,

                uv2x: Math.sin((t+Math.PI/8)/2),
                uv2y: 1.0,

                weightChance: Math.random(),
              });
              // Bark
              gameObjects.push({
                key: `initBlock:${x},${y2},${z},${t}:2`,
                textureUrl: barkTexture,

                p1x: x+Math.sin(t)/(y2+2),
                p1y: ymin + y2,
                p1z: z+Math.cos(t)/(y2+2),

                p2x: x+Math.sin(t)/(y2+3),
                p2y: ymin + y2+1,
                p2z: z+Math.cos(t)/(y2+3),

                p3x: x+Math.sin(t+Math.PI/8)/(y2+3),
                p3y: ymin + y2+1,
                p3z: z+Math.cos(t+Math.PI/8)/(y2+3),

                uv1x: Math.sin(t/2),
                uv1y: 0.0,

                uv2x: Math.sin(t/2),
                uv2y: 1.0,

                uv3x: Math.sin((t+Math.PI/8)/2),
                uv3y: 1.0,

                weightChance: Math.random(),
              });

              // Leaves
              if (y2 != 0){
                gameObjects.push({
                  key: `initBlock:${x},${y},${z}:0`,
                  textureUrl: pineTreeLeavesTexture,
                  p1x: x,
                  p1y: y2+3 + 3*perlin2((x)/10,(z)/10),
                  p1z: z,

                  p3x: x+3*Math.sin(t)/(y2+2),
                  p3y: y2+1 + 3*perlin2(
                                        (x+Math.sin(t)/(y2+1))/10,
                                        (z+Math.cos(t)/(y2+1))/10
                                      ),
                  p3z: z+3*Math.cos(t)/(y2+2),

                  p2x: x+3*Math.sin(t+Math.PI/8)/(y2+2),
                  p2y: y2+1 + 3*perlin2(
                                        (x+Math.sin(t+Math.PI/8)/(y2+1))/10,
                                        (z+Math.cos(t+Math.PI/8)/(y2+1))/10
                                      ),
                  p2z: z+3*Math.cos(t+Math.PI/8)/(y2+2),

                  uv1x: 0.0,
                  uv1y: 0.0,

                  uv3x: 1.0,
                  uv3y: 0.0,

                  uv2x: 0.0,
                  uv2y: 1.0,
                  weightChance: Math.random(),
                });
              }
            }
          }
        }
      }
    }
  }
}

initObjectsForTesting();

let triangleOffsets = [];
let triangleUvs = [];
let triangleRgbas = [];
const triangleVertices = new Float32Array( [
  0, 0.0,  0,
  0, 0.0,  1,
  1, 0.0,  0
] );

const triangleNormals = new Float32Array( [
  0, 1.0,  0,
  0, 1.0,  0,
  0, 1.0,  0
] );

const triangleUVs = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0])
const triangleColorPickers = new Float32Array( [
  0.0,
  0.0,
  0.0
] );

export function redrawObjects() {
  let transformObject = new THREE.Object3D();
  // console.log("starting fetchAndDeleteObjects", window.playerLonLat);
  // const allBlocks = gameObjects;

  const length = Math.min(gameObjects.length, drawInstances);
  // console.log(length);



  for (const key in triangleMeshs){
      // window.objectScene.remove(triangleMeshs[key].mesh);
      triangleMeshs[key].mesh.count = 0;
      triangleMeshs[key]['j'] = 0;
      triangleMeshs[key]['j2'] = 0;
      triangleMeshs[key]['k'] = 0;
  }

  let visibleCount = 0;


  // for (let i = 0, il = length; i < il; i++) {
  for (const key in gameObjects){
    const gameObject = gameObjects[key]
      // visibleCount += 1;
      // if (visibleCount > instances){
      //   break
      // }
      let triangleMesh = undefined;
      if (gameObject.textureUrl in triangleMeshs){
        triangleMesh = triangleMeshs[gameObject.textureUrl]['mesh']
        // console.log("hit", triangleMesh)
      }else{
        const texture = new THREE.TextureLoader().load( gameObject.textureUrl )
        // let texture = undefined;
        // if (gameObject.textureId == 0.0){
        //   texture = new THREE.TextureLoader().load( wood1Url )
        // }else if (gameObject.textureId == 1.0){
        //   texture = new THREE.TextureLoader().load( grass1Url )
        // }else if (gameObject.textureId == 2.0){
        //   texture = new THREE.TextureLoader().load( bark1Url )
        // }else if (gameObject.textureId == 3.0){
        //   texture = new THREE.TextureLoader().load( leaves1Url )
        // }
        const triangleUniforms = THREE.UniformsUtils.merge([
                                    THREE.UniformsLib.shadowmap,
                                    THREE.UniformsLib.lights,
                                    THREE.UniformsLib.ambient,
                                    THREE.UniformsLib.common,
                                    THREE.UniformsLib.specularmap,
                                    THREE.UniformsLib.envmap,
                                    THREE.UniformsLib.aomap,
                                    THREE.UniformsLib.lightmap,
                                    THREE.UniformsLib.emissivemap,
                                    THREE.UniformsLib.fog,
                                    {
                                        texture: { type:'t', value: null }, // See why this is null https://www.bountysource.com/issues/30181245-three-uniformsutils-merge-shoudnt-clone-the-texture
                                    },
                                ])
        triangleUniforms.texture.value = texture;

        const triangleMaterial = new THREE.ShaderMaterial({
          uniforms: triangleUniforms,
          vertexShader: vs,
          fragmentShader: fs
        });
        triangleMaterial.lights = true;
        // triangleMaterial.side = THREE.DoubleSide;
        const triangleGeometry = new THREE.BufferGeometry();

        // const triangleUVs2 = new Float32Array( [
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0
        // ] );
        // const triangleColor = new Float32Array( [0.0, 0.0, 0.0, 0.0] )

        triangleGeometry.setAttribute( 'position', new THREE.BufferAttribute( triangleVertices, 3 ) );
        triangleGeometry.setAttribute( 'normal', new THREE.BufferAttribute( triangleNormals, 3 ) );
        triangleGeometry.setAttribute( 'uv', new THREE.BufferAttribute( triangleUVs, 2 ) );
        // triangleGeometry.setAttribute( 'isColorPicker', new THREE.BufferAttribute( triangleColorPickers, 1 ) );
        // triangleGeometry.setAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array(triangleOffsets), 3 ) );
        // triangleGeometry.setAttribute( 'uvalt', new THREE.BufferAttribute( new Float32Array(triangleUvs), 2 ) );
        // triangleGeometry.setAttribute( 'rgba', new THREE.InstancedBufferAttribute( new Float32Array(triangleRgbas), 4 ) );
        triangleMesh = new THREE.InstancedMesh( triangleGeometry, triangleMaterial, drawInstances);
        triangleMesh.castShadow = true;
        triangleMesh.receiveShadow = true;
        // triangleMesh.instanceUVMatrix = new THREE.BufferAttribute( new Float32Array( length * 16 ), 16 );
        // triangleMesh.position.y = -window.playerY;
        triangleMesh.count = 0;
        triangleMeshs[gameObject.textureUrl] = {"mesh": triangleMesh, "j": 0, "j2": 0, "k": 0};
        // console.log('triangleMesh', triangleMesh)
        objectScene.add(triangleMesh);
        triangleMeshInstanceIDKeys[triangleMesh.uuid] = {}
      }

      // if (!(triangleMesh.uuid in window.triangleMeshInstanceIDKeys)){
      //     window.triangleMeshInstanceIDKeys[triangleMesh.uuid] = {}
      // }

      let j = triangleMesh.count
      let k = triangleMesh.count

      // Only do the work if key doesn't match the index.
      // if(window.triangleMeshInstanceIDKeys[triangleMesh.uuid][i] != triangleMesh.count){
        let matrix = new THREE.Matrix4();
        matrix.set( gameObject.p2x - gameObject.p1x, 0, gameObject.p3x - gameObject.p1x, gameObject.p1x,
                    gameObject.p2y - gameObject.p1y, 1, gameObject.p3y - gameObject.p1y, gameObject.p1y,
                    gameObject.p2z - gameObject.p1z, 0, gameObject.p3z - gameObject.p1z, gameObject.p1z,
                    0,                               0, 0,                               1  );
        triangleMesh.setMatrixAt(j++, matrix);
        triangleMesh.instanceMatrix.needsUpdate = true;


        matrix.set(
                    1, 0, 0, 0,
                    0, 1, 0, 1,
                    0, 0, 1, 0,
                    0, 0, 0, 1  );

        matrix.toArray( triangleMesh.instanceNormalMatrix.array, k * 16 );
        triangleMesh.instanceNormalMatrix.needsUpdate = true;


        // transformObject.position.set(1.0, 1.0, 0.0);
        // transformObject.scale.set(1.0, 1.0, 1.0);
        // transformObject.rotation.set(0.0, 0.0, 0.0)
        // // console.log(allBlocks[i].rotationZ)
        // transformObject.updateMatrix();
        matrix.set( gameObject.uv2x - gameObject.uv1x, gameObject.uv3x - gameObject.uv1x, 0, gameObject.uv1x,
                    gameObject.uv2y - gameObject.uv1y, gameObject.uv3y - gameObject.uv1y, 0, gameObject.uv1y,
                    0, 0, 1, 1,
                    0, 0, 0, 1);
        matrix.toArray( triangleMesh.instanceUVMatrix.array, k * 16 );
        triangleMesh.instanceUVMatrix.needsUpdate = true;

        // console.log(allBlocks[i].colorPicker)
        // const color = new THREE.Color(0).setHex( gameObject.colorPicker )

        // triangleMesh.geometry.attributes.rgba.setXYZW( triangleMesh.count, color.r, color.g, color.b, 1.0);
        // triangleMesh.geometry.attributes.rgba.setXYZW( j2+1, color.r, color.g, color.b, 1);
        // triangleMesh.geometry.attributes.rgba.setXYZW( j2+2, color.r, color.g, color.b, 1);
        // triangleMesh.geometry.attributes.rgba.needsUpdate = true;

        // triangleMesh.geometry.attributes.uvalt.count += 1;
        // triangleMesh.geometry.attributes.uvalt.setXY( 3*triangleMesh.count, gameObject.uv1x, gameObject.uv1y);
        // triangleMesh.geometry.attributes.uvalt.setXY( 3*triangleMesh.count+1, gameObject.uv2x, gameObject.uv2y);
        // triangleMesh.geometry.attributes.uvalt.setXY( 3*triangleMesh.count+2, gameObject.uv3x, gameObject.uv3y);
        // triangleMesh.geometry.attributes.uvalt.needsUpdate = true;

        triangleMeshInstanceIDKeys[triangleMesh.uuid][triangleMesh.count] = i;
        // window.triangleMeshInstanceIDKeys[triangleMesh.uuid][i] = triangleMesh.count;
      // }

      triangleMesh.count += 1;

  }
  console.log(triangleMeshs)
  for (const key in triangleMeshs){
    if(triangleMeshs[key].mesh.count == 0){
      // Clean up any meshes that don't have instances
      delete triangleMeshs[key];
    }else{

    }
  }

  console.log("finished redrawObjects");
}
