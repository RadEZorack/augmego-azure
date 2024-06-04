export function changeName(){
    const name = $("#changeNameInput").val()
    $.ajax({
        url: changeNameURL,
        type: 'GET',
        data: {
            csrfmiddlewaretoken: csrfmiddlewaretoken,
            name: name
        },
        success: function(resp) {
            console.log("success change name", resp)
            $("#changeNameInput").val(resp)
            $("#screenName").html(resp)
            // TODO update socket connections
        },
        error: function (request, status, error) {
            $("#loadingSpinner").hide()
            console.log(status+": "+request.responseText)
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    })
}