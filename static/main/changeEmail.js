export function changeEmail(){
    const email = $("#changeEmailInput").val()
    console.log(email)
    $.ajax({
        url: changeEmailURL,
        type: 'GET',
        data: {
            csrfmiddlewaretoken: csrfmiddlewaretoken,
            email: email
        },
        success: function(resp) {
            console.log("success change email", resp)
        },
        error: function (request, status, error) {
            $("#loadingSpinner").hide()
            console.log(status+": "+request.responseText)
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    })
}