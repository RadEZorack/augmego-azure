export function changePassword(){
    const password = $("#changePasswordInput").val()
    $.ajax({
        url: changePasswordURL,
        type: 'GET',
        data: {
            csrfmiddlewaretoken: csrfmiddlewaretoken,
            password: password
        },
        success: function(resp) {
            console.log("success change password", resp)
        },
        error: function (request, status, error) {
            $("#loadingSpinner").hide()
            console.log(status+": "+request.responseText)
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    })
}