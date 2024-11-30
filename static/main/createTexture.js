import { fetchTextureAtlas } from '../main/redrawObjects.js';
// import { familyName } from '../main/family.js';

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
        familyName: 'Lobby'
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

$('#uploadTextureForm').on('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    $("#loadingSpinner").show()

    let title = $("#uploadTextureName").val()
    var formData = new FormData();
    var fileInput = $('#uploadTextureInput')[0].files[0];
    formData.append('textureFile', fileInput);
    formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken);
    formData.append('title', title);
    formData.append('familyName', familyName);

    $.ajax({
        url: textureUploadURL,
        type: 'POST',
        data: formData,
        processData: false, // Important!
        contentType: false, // Important!
        success: function(response) {
            $("#loadingSpinner").hide();
            window.location.reload()
            $("#generalToast .toast-body").html("File uploaded successfully!");
            $("#generalToast").toast("show");
        },
        error: function(request, status, error) {
            $("#loadingSpinner").hide()
            // $('#result').html('<p>File upload failed: ' + error + '</p>');
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    });
});