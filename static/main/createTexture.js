import { textureLoad } from '../main/initTexturePanel.js';

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
        description: description
        },
        success: function(resp) {
            console.log("success texture");
            // Reload texture panel
            textureLoad();
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
