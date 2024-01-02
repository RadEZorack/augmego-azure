export let qDown = false;
export let wDown = false;
export let eDown = false;
export let aDown = false;
export let sDown = false;
export let dDown = false;
export let enterDown = false;
export let QWE = true;
export let ASD = true;

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
    if (event.key == "Enter"){
        enterDown = true;
    }

    if(enterDown && qDown && wDown && eDown){
        // Activate keyboard walk
        QWE = !QWE;
    }

    if(enterDown && aDown && sDown && dDown){
        // Activate mouse turn
        ASD = !ASD;
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
    if (event.key == "Enter"){
        enterDown = false;
    }
});