import { drawChunkBounds } from '../main/chunk.js';

let toggleLandClaimView = false;

$(document).ready(function() {
    $('.command').on("touchstart click", function() {
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
        }
    });
});