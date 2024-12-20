import { myPlayer, playerWrapper } from '../main/player.js';
import { peerConnections, message_que } from '../main/socketConnection.js';
import { playerAnimation } from '../main/animate.js';

function sendPlayerGlobalData(){
    // console.log('player_send_xhr')
    const now = new Date();
    const player_send_xhr = setTimeout(function(){
        if (!(myPlayer === undefined)){
            message_que.push({
                'type': 'playerping',
                'name': my_name,
                'myUuid': myUuid,
                'avatar': avatar,
                'avatar_animations': avatar_animations,
                'x': playerWrapper.position.x,
                'y': playerWrapper.position.y,
                'z': playerWrapper.position.z,
                'rx': playerWrapper.rotation.x,
                'ry': playerWrapper.rotation.y,
                'rz': playerWrapper.rotation.z,
                'time': now.getTime(),
                'animation': playerAnimation,
            })
        }
        // console.log('message_que', myPlayer.scene, message_que)
        sendPlayerGlobalData()
    }, 1000)
}

export function sendPlayerPeerData(){
    // console.log('player_send_xhr')
    // const player_send_xhr = setTimeout(function(){
        const now = new Date();
        for (let uuid in peerConnections){
            let sendChannel = peerConnections[uuid].sendChannel
            if (sendChannel != undefined && sendChannel.readyState == "open"){
                // console.log("send playermove", uuid)
                sendChannel.send(JSON.stringify({
                    'type': 'playermove',
                    'name': my_name,
                    'entity_key': "player:"+myUuid,
                    'myUuid': myUuid,
                    'avatar': avatar,
                    'avatar_animations': avatar_animations,
                    'x': playerWrapper.position.x,
                    'y': playerWrapper.position.y,
                    'z': playerWrapper.position.z,
                    'rx': playerWrapper.rotation.x,
                    'ry': playerWrapper.rotation.y,
                    'rz': playerWrapper.rotation.z,
                    'time': now.getTime(),
                    'animation': playerAnimation,
                }))
            }
            let receiveChannel = peerConnections[uuid].receiveChannel
            // console.log(receiveChannel.readyState)
            if (receiveChannel != undefined && receiveChannel.readyState == "open"){
                // console.log("keep alive")
                receiveChannel.send(JSON.stringify({"keep alive": "keep alive"}));
            }
        }
    //     sendPlayerPeerData()
    // }, 50)
}

sendPlayerGlobalData();
sendPlayerPeerData();