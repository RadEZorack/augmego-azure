// import * as THREE from '../three/three.module.min.js';
import { GLTFLoader } from '../three/GLTFLoader.js';
import { DRACOLoader } from '../three/DRACOLoader.js';
import { objectScene } from '../main/main.js';

// Instantiate a loader
var gltf_loader = new GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
var dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( "" );
gltf_loader.setDRACOLoader( dracoLoader );

gltf_loader.load(
    // resource URL
    "https://models.readyplayer.me/64ea136842c59d7dceab60d8.glb",
    // called when the resource is loaded
    function ( gltf ) {
        // console.log('gltf', gltf)
        objectScene.add( gltf.scene );
    }
);