import * as THREE from '../three/three.module.js';
import { GLTFLoader } from '../three/GLTFLoader.js';
import { DRACOLoader } from '../three/DRACOLoader.js';
import { create3dPage } from '../main/webpage3d.js';
import { objectScene, cssScene, camera } from '../main/main.js';
import { initWebcamPage } from '../main/initWebcamPage.js';
import { myPlayer } from '../main/player.js';


export var entities = {}
var my_position = undefined
// Instantiate a loader
var gltf_loader = new GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
var dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( dracoLoaderUrl );
gltf_loader.setDRACOLoader( dracoLoader );
export function update_entity(entity_data){
  // console.log(entity_data.time, entity_data.z, entity_data.type)
    let entity_key = entity_data['entity_key']
    let name = entity_data['name']
    let x = entity_data['x']
    let y = entity_data['y']
    let z = entity_data['z']
    let rx = entity_data['rx']
    let ry = entity_data['ry']
    let rz = entity_data['rz']
    let animation = entity_data['animation']

    // console.log("----here");
    // console.log(entity_key);

    if (entity_key == "player:undefined" ){
        return
    }else if (entity_key == "player:"+myUuid){
        // if (my_position == undefined || Math.sqrt((my_position.x - x)**2 + (my_position.y - y)**2 + (my_position.z - z)**2) >= 0.9){
        //     // Player has either started or cheated or moved up a block
        // }
        if (my_position == undefined){
            // Player has started
            my_position = new THREE.Vector3(x, y, z)
            // camera.position.set( x, y, z );
        }
        // console.log(rx, ry, rz )
        // camera.rotation.set( rx, ry - Math.PI, rz );

    }else if (!(entity_key in entities)){
        entities[entity_key] = "loading"
        console.log("3.a. new entity", name, entity_key, entities)
        const entityUuid = entity_key.split(":")[1]
        // $.ajax({
        //   url: webcamUrl+'?entityUuid='+entityUuid+"&entityName="+name+"&myUuid="+myUuid+"&room_name=lobby",
        //   type: 'GET',
        //   success: function(resp) {

        let webcamHtml = `
            <div class="video-container" style="width: 100px; height: 100px; background-color: black;">
                <div style="position: absolute; top: 5px; left: 50%; transform: translate(-50%, 0);">${name}</div>
                <video autoplay class="remote-video" id="remote-video-${entityUuid}" style="max-width: 100%; max-height: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></video>
            </div>
        `

        const page = create3dPage(
            // 1.5m wide
            100, 100,
            0.005,
            new THREE.Vector3(x, y + 2, z),
            new THREE.Vector3(0, ry, 0),
            "",
            webcamHtml);

        // parseScript(resp);
        // initWebcamPage(myUuid, entityUuid);

        gltf_loader.load(
            // resource URL
            // "https://models.readyplayer.me/64ea136842c59d7dceab60d8.glb",
            cesiumManUrl,
            // called when the resource is loaded
            function ( gltf ) {
                // console.log('gltf', gltf)
                objectScene.add( gltf.scene );


                entities[entity_key] = {
                    'gltf': gltf,
                    'plane': page.plane,
                    'cssObject': page.cssObject,
                    'mixer': new THREE.AnimationMixer(gltf.scene),
                    'animation': 0,
                }
                // console.log("passed")

                gltf.scene.position.x = x
                gltf.scene.position.y = y
                gltf.scene.position.z = z

                // gltf.scene.rotation.x = rx
                gltf.scene.rotation.y = ry
                // gltf.scene.rotation.z = rz
                // gltf.scene.rotateY(Math.PI/2) // flip around
                // gltf.scene.rotation.x = 0
                // gltf.scene.rotation.z = 0

                gltf.scene.scale.x = 1
                gltf.scene.scale.y = 1
                gltf.scene.scale.z = 1

                // plane.translateZ(-50)
                // plane.translateY(325)

                // cssobject.translateZ(-50)
                // cssobject.translateY(325)

                // gltf.animations; // Array<THREE.AnimationClip>
                // gltf.scene; // THREE.Group
                // gltf.scenes; // Array<THREE.Group>
                // gltf.cameras; // Array<THREE.Camera>
                // gltf.asset; // Object
                console.log("finished entity", entity_key, entities)
                initWebcamPage(myUuid, entityUuid);

            },
            // called while loading is progressing
            function ( xhr ) {

            //   console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened', error );

            }
        );
        //   }
        // })
        // entities[entity_key] = {
        //             'plane': page.plane,
        //             'cssobject': page.cssObject
        // }


    }else if (entities[entity_key] == "loading"){
        console.log("loading")
        return
    }else{
        // console.log("entity moving", entity_data)
        const gltf = entities[entity_key]['gltf']

        gltf.scene.position.x = x
        gltf.scene.position.y = y
        gltf.scene.position.z = z

        const gltfEuler = new THREE.Euler(0, 0, 0, "YXZ")

        gltf.scene.rotation.x = rx
        gltf.scene.rotation.y = ry;
        gltf.scene.rotation.z = rz

        // flip around
        // not needed
        // gltfEuler.setFromQuaternion(gltf.scene.quaternion)
        // gltfEuler.x = 0;
        // gltfEuler.y += Math.PI;
        // gltfEuler.z = 0;
        // gltf.scene.quaternion.setFromEuler(gltfEuler)


        // gltf.scene.rotation.x = 0
        // gltf.scene.rotation.z = 0

        const plane = entities[entity_key]['plane']

        plane.position.x = x
        plane.position.y = y + 2.5;
        plane.position.z = z

        // planeLookAt + camera.position

        plane.lookAt(camera.position)

        // plane.rotation.x = rx;
        // plane.rotation.y = ry;
        // // plane.rotation.y += Math.PI;
        // plane.rotation.z = rz;

        // flip around
        // Enable this to keep the web cam level.
        // gltfEuler.setFromQuaternion(plane.quaternion)
        // gltfEuler.x = 0;
        // gltfEuler.y += Math.PI;
        // gltfEuler.z = 0;
        // plane.quaternion.setFromEuler(gltfEuler)

        const cssObject = entities[entity_key]['cssObject']

        cssObject.position.x = plane.position.x;
        cssObject.position.y = plane.position.y;
        cssObject.position.z = plane.position.z;

        cssObject.rotation.x = plane.rotation.x;
        cssObject.rotation.y = plane.rotation.y;
        cssObject.rotation.z = plane.rotation.z;

        // plane.translateZ(-50)
        // plane.translateY(325)

        // cssobject.translateZ(-50)
        // cssobject.translateY(325)

        entities[entity_key]['animation'] = animation
    }
}

export function remove_entity(entity_key){
    // let entity_key = entity_data['entity_key']
    console.log("removing:", entity_key, entities[entity_key])
    if (entities[entity_key] && !(entities[entity_key] == "loading")){
        const gltf = entities[entity_key]['gltf']
        objectScene.remove( gltf.scene );
        const plane = entities[entity_key]['plane']
        objectScene.remove(plane);
        const cssObject = entities[entity_key]['cssObject']
        cssScene.remove(cssObject);

        // When changing names we need to give some time tolerance before readding the same player.
        entities[entity_key] = "loading"
        setTimeout(function(){
            // Delete the player to allow them to rejoin.
            delete entities[entity_key]
        }, 1000)
    }
}

function animateEntities(){
    for (entity_key in entities){
        let animation = entities[entity_key]['animation']
        if (animation != undefined){
            let mixer = entities[entity_key]['mixer']
            let clip = gltf.animations[animation]
            action = mixer.clipAction( clip );
            action.play();
            if (mixer){
                mixer.update( 2 * clock.getDelta() );
            }
        }
    }
}
