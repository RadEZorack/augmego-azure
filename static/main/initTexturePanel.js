import { initToggleMouseOption } from '../main/mouseClicks.js';
import { initObjects } from '../main/initObjects.js';

export function textureLoad(){
    // if (stopAnimate == true){
    //     // We need the player to interact with the page before things will work correctly.
    //     // So we loop until we get the flag to start, which can be found on the main page.
    //     const stopAnimateXHR = setTimeout(function(){
    //         textureLoad()
    //     }, 1000)
    //     return null
    // }

    $.ajax({
        url: textureLoadURL,
        type: 'GET',
        success: function(resp) {
            const container = document.getElementById('texturePanel');
            container.innerHTML = ""

            let row = document.createElement('div');
            row.className = 'row';

            resp.forEach((image, index) => {
                // console.log(index, resp.length)
                const col = document.createElement('div');
                col.className = 'col-3 mb-3'; // added mb-3 for some bottom margin

                const img = `<img width="64px" height="64px" class="toggleMouseOption img-fluid" data-type="create" data-material="${image['name']}" style="border: solid 2px red;" src="${image["image_url"]}" alt="Toggle block place on">`

                col.innerHTML = img;
                row.appendChild(col);

                // Every 3 images or if it's the last image, append the row to the container and create a new row
                if ((index + 1) % 4 === 0 || index + 1 === resp.length) {
                    console.log("hit")
                container.appendChild(row);
                row = document.createElement('div');
                row.className = 'row';
                }
            });
            // console.log(resp);
            for(const i in resp){
                // const space = (i * 5).toString();
                const fields = resp[i]
                // const img = $("#texturePanel").append(
                //     `<img class="toggleMouseOption" data-type="create" data-material="${fields['name']}" style="border: solid 2px red;" src="${fields["image_url"]}" alt="Toggle block place on"></br>`
                // )
                
                if(fields['name'] == "Grass"){
                    grassTexture = fields["image_url"]
                }else if(fields['name'] == "Dirt"){
                    dirtTexture = fields["image_url"];
                }else if(fields['name'] == "Bark"){
                    barkTexture = fields["image_url"];
                }else if(fields['name'] == "Pine Tree Leaves"){
                    pineTreeLeavesTexture = fields["image_url"];
                }else if(fields['name'] == "Buy Sign"){
                    buySignTexture = fields["image_url"];
                }else if(fields['name'] == "Owned Sign"){
                    ownedSignTexture = fields["image_url"];
                }else if(fields['name'] == "Sold Sign"){
                    soldSignTexture = fields["image_url"];
                }else if(fields['name'] == "Yellow Gravel"){
                    yellowGravelTexture = fields["image_url"];
                }else if(fields['name'] == "Black Gravel"){
                    blackGravelTexture = fields["image_url"];
                }else if(fields['name'] == "White Gravel"){
                    whiteGravelTexture = fields["image_url"];
                }else if(fields['name'] == "Concrete"){
                    concreteTexture = fields["image_url"];
                }
            }
            initToggleMouseOption();
            initObjects();
        }
    })
}

