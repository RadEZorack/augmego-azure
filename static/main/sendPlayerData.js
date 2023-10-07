function sendPlayerGlobalData(){
    // console.log('player_send_xhr')
    const player_send_xhr = setTimeout(function(){
        message_que.push({
            'type': 'playerping',
            'name': my_name,
            'myUuid': myUuid,
            'x': window.camera.position.x,
            'y': window.camera.position.y,
            'z': window.camera.position.z,
            'rx': window.camera.rotation.x,
            'ry': window.camera.rotation.y,
            'rz': window.camera.rotation.z,
            'time': now.getTime(),
        })
        // console.log('message_que', window.camera, message_que)
        sendPlayerGlobalData()
    }, 1000)
}

function sendPlayerPeerData(){
    // console.log('player_send_xhr')
    // const player_send_xhr = setTimeout(function(){
        for (uuid in peerConnections){
            let sendChannel = peerConnections[uuid].sendChannel
            if (sendChannel != undefined && sendChannel.readyState == "open"){
                sendChannel.send(JSON.stringify({
                    'type': 'playermove',
                    'name': my_name,
                    'entity_key': "player:"+myUuid,
                    'myUuid': myUuid,
                    'x': window.camera.position.x,
                    'y': window.camera.position.y,
                    'z': window.camera.position.z,
                    'rx': window.camera.rotation.x,
                    'ry': window.camera.rotation.y,
                    'rz': window.camera.rotation.z,
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
