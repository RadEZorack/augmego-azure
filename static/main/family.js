function refreshFamilies(){
    console.log("refreshFamilies")
    $.ajax({
        url: familyListURL,
        type: 'GET',
        success: function(resp) {
            console.log(resp)
            let html = ""
            for (const [key, value] of Object.entries(resp)) {
                html += `<h5>${key}</h5>
                <input type="text" id="addPersonInput-${key}" data-for"${key}" name="addPersonInput-${key}" placeholder="user name">
                <button id="addPersonBtn-${key}" data-forFamily="${key}"type="button" class="btn btn-success addPersonBtn" >Add <i class="fas fa-plus"></i></button>
                <ul>`
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

// function setActiveFamily(familyName){
//     $.ajax({
//         url: setActiveFamilyURL,
//         type: 'POST',
//         data: {
//             csrfmiddlewaretoken: csrfmiddlewaretoken,
//             familyName: familyName
//             },
//         success: function(resp) {
//             refreshFamilies();
//         },
//         error: function (request, status, error) {
//             $("#generalToast .toast-body").html(status+": "+request.responseText);
//             $("#generalToast").toast("show");
//         }
//     })
// }

