// export let familyName = undefined
export let familyName = "Lobby"

function refreshFamilies(){
    console.log("refreshFamilies")
    $.ajax({
        url: familyListURL,
        type: 'GET',
        success: function(resp) {
            console.log(resp)
            let html = ""
            for (const [key, value] of Object.entries(resp)) {
                let isActiveData = "false";
                let isActiveText = "Activate"
                let isActiveIcon = '<i class="fas fa-play"></i>'
                let isActiveColor = 'warning'
                if (value.is_active == true){
                    // familyName = key;
                    isActiveData = "true";
                    isActiveText = "Active";
                    isActiveIcon = '<i class="fas fa-times"></i>';
                    isActiveColor = 'success'
                }
                html += `<h5>${key} <button id="setActiveFamilyBtn-${key}" data-forFamily="${key}" data-isActiveData="${isActiveData}" type="button" class="btn btn-${isActiveColor} setActiveFamilyBtn" >${isActiveText} ${isActiveIcon}</button></h5>`
                
                if(key != "Lobby"){
                    html += `<input type="text" id="addPersonInput-${key}" data-for"${key}" name="addPersonInput-${key}" placeholder="user name">
                    <button id="addPersonBtn-${key}" data-forFamily="${key}"type="button" class="btn btn-success addPersonBtn" >Add <i class="fas fa-plus"></i></button>
                    <ul>`
                }
                
                value.people.forEach(element => {
                    html += `<li>${element}</li>`
                });
                html += "</ul><br>"
            }
            $("#familiesListing").html(
                html
            )

            $(".addPersonBtn").on("click", function(){
                addPerson($(this).attr("data-forFamily"));
            })

            $(".setActiveFamilyBtn").on("click", function(){
                // if ($(this).attr("data-isActiveData") == "true"){
                //     return;
                // }
                setActiveFamily($(this).attr("data-forFamily"));
            })
        }
    })
}

$("#refreshFamilies").on("click", function(){
    refreshFamilies();
})

refreshFamilies();

function createFamily(){
    $.ajax({
        url: createFamilyURL,
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrfmiddlewaretoken,
            name: $("#addFamilyName").val(),
            password: $("#addFamilyPassword").val()
            },
        success: function(resp) {
            refreshFamilies();
        },
        error: function (request, status, error) {
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    })
}

$("#createFamily").on("click", function(){
    createFamily();
})

function joinFamily(){
    $.ajax({
        url: joinFamilyURL,
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrfmiddlewaretoken,
            name: $("#joinFamilyName").val(),
            password: $("#joinFamilyPassword").val()
            },
        success: function(resp) {
            refreshFamilies();
        },
        error: function (request, status, error) {
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    })
}

$("#joinFamily").on("click", function(){
    joinFamily();
})

function addPerson(familyName){
    $.ajax({
        url: addPersonURL,
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrfmiddlewaretoken,
            familyName: familyName,
            personName: $(`#addPersonInput-${familyName}`).val()
            },
        success: function(resp) {
            refreshFamilies();
        },
        error: function (request, status, error) {
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    })
}

function setActiveFamily(familyName){
    $.ajax({
        url: setActiveFamilyURL,
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrfmiddlewaretoken,
            familyName: familyName
            },
        success: function(resp) {
            // refreshFamilies();
            // initSocketConnection();
            // For simplicity, we simply reload the page. It may be cool to see everything rebuilding around the player, but this is low priority.
            window.location.reload()
        },
        error: function (request, status, error) {
            $("#generalToast .toast-body").html(status+": "+request.responseText);
            $("#generalToast").toast("show");
        }
    })
}

