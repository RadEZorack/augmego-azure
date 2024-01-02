import { camera } from '../main/main.js';

export let qDown = false;
export let wDown = false;
export let eDown = false;
export let aDown = false;
export let sDown = false;
export let dDown = false;
export let oDown = false;
export let pDown = false;
export let enterDown = false;
export let isWalk = true;
export let isFirstPerson = false;

document.addEventListener('keydown', function(event) {
    if (event.key == "q"){
        qDown = true;
    }
    if (event.key == "w"){
        wDown = true;
    }
    if (event.key == "e"){
        eDown = true;
    }
    if (event.key == "a"){
        aDown = true;
    }
    if (event.key == "s"){
        sDown = true;
    }
    if (event.key == "d"){
        dDown = true;
    }
    if (event.key == "o"){
        oDown = true;
    }
    if (event.key == "p"){
        pDown = true;
    }
    if (event.key == "Enter"){
        enterDown = true;
    }

    if(enterDown && oDown){
        // Activate keyboard walk
        isWalk = !isWalk;
    }

    if(enterDown && pDown){
        // Activate first person
        isFirstPerson = !isFirstPerson;
        if(isFirstPerson){
            camera.position.set( 0, 1.75, 0 );
        }else{
            camera.position.set( 0, 2, -5 );
        }
        
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key == "q"){
        qDown = false;
    }
    if (event.key == "w"){
        wDown = false;
    }
    if (event.key == "e"){
        eDown = false;
    }
    if (event.key == "a"){
        aDown = false;
    }
    if (event.key == "s"){
        sDown = false;
    }
    if (event.key == "d"){
        dDown = false;
    }
    if (event.key == "o"){
        oDown = false;
    }
    if (event.key == "p"){
        pDown = false;
    }
    if (event.key == "Enter"){
        enterDown = false;
    }
});