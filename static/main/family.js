function refreshFamilies(){
    console.log("refreshFamilies")
    $.ajax({
        url: familyListURL,
        type: 'GET',
        success: function(resp) {
            console.log(resp)
            let html = ""
            for (const [key, value] of Object.entries(resp)) {
                html += `<h5>${key}</h5><input type="text" id="addPersonBtn-${key}" data-for"${key}" name="addPersonBtn-${key}" placeholder="user name">
              <button type="button" class="btn btn-success" >Add <i class="fas fa-plus"></i></button><ul>`
                value.forEach(element => {
                    html += `<li>${element}</li>`
                });
                html += "</ul>"
            }
            $("#familiesListing").html(
                html
            )
        }
    })
}

$("#refreshFamilies").on("click", function(){
    refreshFamilies();
})

refreshFamilies();