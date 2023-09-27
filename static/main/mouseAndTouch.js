import { mainCanvas } from '../main/main.js';
import { selectedObject } from '../main/raycaster.js';
import { myPlayer } from '../main/player.js';

function singleClick(event) {
    // Moves Player
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      return event.targetTouches[0];
    } else {
      return event;
    }
}

mainCanvas.onmousedown = function(event) {
    event = singleClick(event);
    event = selectedObject(event);
    myPlayer.scene.position.x = event.point.x;
    myPlayer.scene.position.y = event.point.y;
    myPlayer.scene.position.z = event.point.z;
}

// window.leftJoystick.addEventListener(
//     "touchend",
//     function(event) {
//         event.preventDefault();
//         event.stopPropagation();
//         leftJoystickTouchend(event);
//     },
//     false
//     );