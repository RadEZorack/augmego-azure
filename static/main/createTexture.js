import { textureLoad } from '../main/initTexturePanel.js';

export function createTexture(){
    let title = $("#createTextureName").val()
    let description = $("#createTextureName").val()

    $.ajax({
        url: generateImageUrl,
        type: 'POST',
        data: {
        csrfmiddlewaretoken: csrfmiddlewaretoken,
        title: title,
        description: description
        },
        success: function(resp) {
            console.log("success texture");
            // Reload texture panel
            textureLoad();
        }
    })
}
