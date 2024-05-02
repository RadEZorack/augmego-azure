import { drawChunkBounds, buyLand } from '../main/chunk.js';
import { createTexture } from '../main/createTexture.js';
import { playerWrapper } from '../main/player.js';
import { selectedObject } from '../main/raycaster.js';

let toggleLandClaimView = false;

$(document).ready(function() {
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
        }
    });
});