export function fetchAmica(){
    $.ajax({
        url: fetchAmicaURL,
        type: 'GET',
        success: function(resp) {
            $("#amicaTotal").html(resp.data)
        }
    })
}