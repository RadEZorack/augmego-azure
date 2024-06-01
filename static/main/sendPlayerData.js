import { myPlayer, playerWrapper } from '../main/player.js';
import { peerConnections, message_que } from '../main/socketConnection.js';

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
                'x': playerWrapper.position.x,
                'y': playerWrapper.position.y,
                'z': playerWrapper.position.z,
                'rx': myPlayer.scene.rotation.x,
                'ry': myPlayer.scene.rotation.y,
                'rz': myPlayer.scene.rotation.z,
                'time': now.getTime(),
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
                sendChannel.send(JSON.stringify({
                    'type': 'playermove',
                    'name': my_name,
                    'entity_key': "player:"+myUuid,
                    'myUuid': myUuid,
                    'x': playerWrapper.position.x,
                    'y': playerWrapper.position.y,
                    'z': playerWrapper.position.z,
                    'rx': myPlayer.scene.rotation.x,
                    'ry': myPlayer.scene.rotation.y,
                    'rz': myPlayer.scene.rotation.z,
                    'time': now.getTime(),
                }))
            }
            let receiveChannel = peerConnections[uuid].receiveChannel
            if (receiveChannel != undefined && receiveChannel.readyState == "open"){
                console.log("keep alive")
                receiveChannel.send("keep alive")
            }
        }
    //     sendPlayerPeerData()
    // }, 50)
}

sendPlayerGlobalData();
sendPlayerPeerData();