import { drawChunkBounds, buyLand } from '../main/chunk.js';
import { createTexture } from '../main/createTexture.js';
import { playerWrapper } from '../main/player.js';
import { changeName } from '../main/changeName.js';
import { selectedObject } from '../main/raycaster.js';
import { camera } from '../main/main.js';

let toggleLandClaimView = true;
export let isWalk = true;
export let isFirstPerson = false;

$(document).ready(function() {
    drawChunkBounds(true)
    $('.command').on("touchstart click", function(e) {
        // Prevent multiple handlers from firing. Remove if you need both touch and click events handled separately.
        e.stopPropagation(); 
        e.preventDefault();
        
        var command = $(this).data('command');
        console.log('Data-command:', command);
        // You can also do other actions with the command variable here
        
        if (command == "toggleLandClaimView"){
            toggleLandClaimView = !toggleLandClaimView
            console.log(toggleLandClaimView)
            drawChunkBounds(toggleLandClaimView)
        }else if (command == "buyLand"){
            // This buys the land where the player is standing
            buyLand(playerWrapper.position)
        }else if (command == "createTexture"){
            createTexture()
        }else if (command == "toogleFirstPerson"){
            // Activate first person
            isFirstPerson = !isFirstPerson;
            if(isFirstPerson){
                camera.position.set( 0, 1.75, 0 );
            }else{
                camera.position.set( 0, 2, -5 );
            }
        }else if (command == "toogleWalkPerson"){
            // Activate keyboard walk
            isWalk = !isWalk;
        }else if (command == "fastTravel"){
            // Notice the -1 to account for the UI diff
            playerWrapper.position.x = -1 * parseInt($("#fastTravelX").val())
            playerWrapper.position.y = parseInt($("#fastTravelY").val())
            playerWrapper.position.z = parseInt($("#fastTravelZ").val())
        }else if (command == "changeName"){
            changeName();
        }
    });
});