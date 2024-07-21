import { fetchTextureAtlas } from '../main/redrawObjects.js';
import { familyName } from '../main/family.js';

export function createTexture(){
    let title = $("#createTextureName").val()
    let description = $("#createTextureName").val()

    $("#loadingSpinner").show()

    $.ajax({
        url: generateImageUrl,
        type: 'POST',
        data: {
        csrfmiddlewaretoken: csrfmiddlewaretoken,
        title: title,
        description: description,
        familyName: familyName
        },
        success: function(resp) {
            console.log("success texture");
            // Reload texture panel
            // textureLoad();
            fetchTextureAtlas();
            $("#loadingSpinner").hide()
            $("#generalToast .toast-body").html("Success at creating the new block.");
            $("#generalToast").toast("show");
        },
        error: function (request, status, error) {
            $("#loadingSpinner").hide()
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    })
}
