import { initToggleMouseOption } from '../main/mouseClicks.js';
import { initObjects } from '../main/initObjects.js';

$.ajax({
    url: textureLoadURL,
    type: 'GET',
    success: function(resp) {
        // console.log(resp);
        for(const i in resp){
            const space = (i * 5).toString();
            const fields = resp[i]
            const img = $("#texturePanel").append(
                `<img class="toggleMouseOption" data-type="create" data-material="${fields['name']}" style="position: absolute; border: solid 2px red; left:${space}vw" src="${fields["image_url"]}" alt="Toggle block place on" width="${100/18}%" height="100%">`
            )
            
            if(fields['name'] == "Grass"){
                grassTexture = fields["image_url"]
            }else if(fields['name'] == "Dirt"){
                dirtTexture = fields["image_url"];
            }else if(fields['name'] == "Bark"){
                barkTexture = fields["image_url"];
            }else if(fields['name'] == "Pine Tree Leaves"){
                pineTreeLeavesTexture = fields["image_url"];
            }
        }
        initToggleMouseOption();
        initObjects();
    }
})