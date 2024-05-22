import * as THREE from '../three/three.module.min.js';
import { objectScene } from '../main/main.js';
import { vs, fs } from '../main/shaders.js';

function createDefaultObject(defaultValue) {
return new Proxy({}, {
    get: function(target, property) {
    if (!(property in target)) {
        target[property] = defaultValue; // Set the default value if the property doesn't exist
    }
    return target[property];
    }
});
}

export function createDefaultDict(defaultValue) {
return new Proxy({}, {
    get: function(target, property) {
    if (!(property in target)) {
        target[property] = createDefaultObject(defaultValue); // Create a new default object for new keys
    }
    return target[property];
    }
});
}

// Usage
export let gameObjects = createDefaultDict("");
export function initGameObjects(){
    gameObjects = createDefaultDict("");
}
export let quadMeshInstanceIDKeys = {};


const instanceCount = 100000; // Number of instances you want, Putting this number higher may cause unexpected lag.
const quadMeshs = {};
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const instancedQuad = new THREE.InstancedMesh(quadGeometry, material, instanceCount);
const dummyNorth = new THREE.Object3D();
const dummySouth = new THREE.Object3D();
const dummyEast = new THREE.Object3D();
const dummyWest = new THREE.Object3D();
const dummyTop = new THREE.Object3D();
const dummyBottom = new THREE.Object3D();
export let startRedrawObjectsSpinner = true;
let textureAtlasURL = undefined;
let textureAtlasMapping = undefined;

function fetchTextureAtlas(){
    $.ajax({
        url: textureAtlasLoadURL,
        type: 'GET',
        success: function(resp) {
            textureAtlasURL = resp[0];
            textureAtlasMapping = resp[1];
            redrawObjects();
        }
    })
}

export function redrawObjects() {
    startRedrawObjectsSpinner = true;

    if (textureAtlasURL == undefined || textureAtlasMapping == undefined) {
        fetchTextureAtlas();
        return;
    }
    console.log(textureAtlasURL)

    startRedrawObjectsSpinner = true;

    const textureCount = {}

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureAtlasURL, function(textureAtlas) {
        console.log(textureAtlas)
        const textureData = textureAtlasMapping;
        console.log(textureData)

        const instanceData = Object.values(gameObjects)
        console.log(instanceData)

        

        const textureSize = 64; // Assuming each texture is 64x64 pixels
        const texturesCount = Object.keys(textureData).length;

        // Calculate the number of columns and rows needed
        const atlasColumns = Math.floor(Math.sqrt(texturesCount)); // This should be ceil, but in python we cimply convert to int which floors things
        const atlasRows = Math.floor(texturesCount / atlasColumns);

        // Calculate the dimensions of the atlas
        const atlasWidth = atlasColumns * textureSize;
        const atlasHeight = atlasRows * textureSize;
        console.log(atlasWidth, atlasHeight)

        const geometry = new THREE.PlaneGeometry(1, 1);
        // const geometry = new THREE.BufferGeometry();

        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        const vertices = new Float32Array( [
            0.0, 0.0,  1.0, // v0
            1.0, 0.0,  1.0, // v1
            1.0, 1.0,  1.0, // v2

            1.0,  1.0,  1.0, // v3
            0.0,  1.0,  1.0, // v4
            0.0,  0.0,  1.0  // v5
        ] );

        // itemSize = 3 because there are 3 values (components) per vertex
        // geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const instancedGeometry = new THREE.InstancedBufferGeometry().copy(geometry);

        const uvOffsets = new Float32Array(instanceData.length * 2);
        const positions = new Float32Array(instanceData.length * 3);
        const quaternion = new THREE.Quaternion();

        instanceData.forEach((data, i) => {
        // for (const key in gameObjects){
            // const xyz = key.split(":")[1].split(",");
            // const x = parseInt(xyz[0]);
            // const y = parseInt(xyz[1]);
            // const z = parseInt(xyz[2]);

            // const direction = key.split(":")[2]

            // console.log(data)
            if (data != ""){
                const texture = textureData[data.texture_name];

                uvOffsets[i * 2] = texture.x / atlasWidth;
                uvOffsets[i * 2 + 1] = texture.y / atlasHeight;

                positions[i * 3] = data.x;
                positions[i * 3 + 1] = data.y;
                positions[i * 3 + 2] = data.z;
            }
        });

        instancedGeometry.setAttribute('uvOffset', new THREE.InstancedBufferAttribute(uvOffsets, 2));
        // instancedGeometry.setAttribute('position', new THREE.InstancedBufferAttribute(positions, 3));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                textureAtlas: { type: 't', value: textureAtlas },
                atlasWidth: { type: 'f', value: atlasWidth },
                atlasHeight: { type: 'f', value: atlasHeight }
            },
            vertexShader: `
                varying vec2 vUv;
                attribute vec2 uvOffset;

                uniform float atlasWidth;
                uniform float atlasHeight;

                void main() {
                    vUv = 64.0 * uv * vec2(1.0 / atlasWidth, 1.0 / atlasHeight) + uvOffset;
                    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D textureAtlas;
                varying vec2 vUv;

                void main() {
                    gl_FragColor = texture2D(textureAtlas, vUv);
                }
            `
        });

        const mesh = new THREE.InstancedMesh(instancedGeometry, material, instanceData.length);
        objectScene.add(mesh);
        

        // Set instance positions
        // This roundingErrorFix causes us to round in the correct direction when placing or destorying blocks.
        const roundingErrorFix = 0.5001;

        for (let i = 0; i < instanceData.length; i++) {
            // break
            // const matrix = new THREE.Matrix4();
            // matrix.setPosition(instanceData[i].x, instanceData[i].y, instanceData[i].z);
            // mesh.setMatrixAt(i, matrix);
            const x = instanceData[i].x
            const y = instanceData[i].y
            const z = instanceData[i].z
            const direction = instanceData[i].direction
            switch (direction){
                case "north":
                    // Facing North
                    dummyNorth.position.set(x,y,z+roundingErrorFix); // Set position
                    dummyNorth.rotation.set(0,0,0); // Set rotation
                    dummyNorth.updateMatrix();
                    mesh.setMatrixAt(i, dummyNorth.matrix);
                    break;
                
                case "south":
                    // Facing South
                    dummySouth.position.set(x,y,z-roundingErrorFix); // Set position
                    dummySouth.rotation.set(0,Math.PI,0); // Set rotation
                    dummySouth.updateMatrix();
                    mesh.setMatrixAt(i, dummySouth.matrix);
                    break;
    
                case "east":
                    // Facing East
                    dummyEast.position.set(x-roundingErrorFix,y,z); // Set position
                    dummyEast.rotation.set(0,-Math.PI/2,0); // Set rotation
                    dummyEast.updateMatrix();
                    mesh.setMatrixAt(i, dummyEast.matrix);
                    break;
    
                case "west":
                    // Facing West
                    dummyWest.position.set(x+roundingErrorFix,y,z); // Set position
                    dummyWest.rotation.set(0,Math.PI/2,0); // Set rotation
                    dummyWest.updateMatrix();
                    mesh.setMatrixAt(i, dummyWest.matrix);
                    break;
    
                case "top":
                    // Facing Up/top
                    dummyTop.position.set(x,y+roundingErrorFix,z); // Set position
                    dummyTop.rotation.set(-Math.PI/2,0,0); // Set rotation
                    dummyTop.updateMatrix();
                    mesh.setMatrixAt(i, dummyTop.matrix);
                    break;
    
                case "bottom":
                    // Facing Up/top
                    dummyBottom.position.set(x,y-roundingErrorFix,z); // Set position
                    dummyBottom.rotation.set(Math.PI/2,0,0); // Set rotation
                    dummyBottom.updateMatrix();
                    mesh.setMatrixAt(i, dummyBottom.matrix);
                    break;
            }
        }

        mesh.instanceMatrix.needsUpdate = true;
        console.log(mesh)
    });
    
    startRedrawObjectsSpinner = false;
    $("#loadingSpinner").hide()
}