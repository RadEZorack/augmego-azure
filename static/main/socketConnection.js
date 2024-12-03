import { entities, update_entity, remove_entity } from '../main/entity.js';
import { fetchAmica } from '../main/amica.js';
import { playerWrapper } from '../main/player.js'

console.log(window.location.host)

export let socket = undefined
export let peerConnections = {}
export let message_que = []

export function initSocketConnection(){
  // $('#globalChatIframe').attr('src', 'https://' + window.location.host + '/chat/global/')
  if (socket != undefined){
    socket.close()
    for (const [key, value] of Object.entries(peerConnections)) {
      peerConnections[key].peerConnection.close()
      delete peerConnections[key]
    }

    for (const [key, value] of Object.entries(entities)) {
      remove_entity(key)
    }
  }

  socket = new WebSocket(
      'wss://' + window.location.host +
      '/ws/game/room_name/' // TODO make multiple rooms
  );

  // WebRTC
  const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = window;
  

  console.log("1. ", socket)

  let send_message_que_xhr;

  function send_message_que(){
      // Send an instant message, reset que, then try sending another message
      const now = new Date();
      message_que.push({
          'type': 'my_keys',
          'my_name': my_name,
          'myUuid': myUuid,
          'avatar': avatar,
          'keys': [],
          'time': now.getTime(),
          })

      if (my_name != undefined && socket.readyState == WebSocket.OPEN){
          // console.log("sending", message_que)
          socket.send(JSON.stringify({'message_que': message_que}));
          // socket.emit('message_que', message_que)
      }
      message_que = []
      send_message_que_xhr = setTimeout(function(){
          // console.log("message sent")
          send_message_que()
      }, 1000)

  }

  socket.onopen = function(e) {
      console.log('socket connected')
      send_message_que()
  }

  socket.onclose = function(e) {
      console.log('Chat socket closed unexpectedly', e);
  };

  socket.onerror = function(e) {
    console.error('Chat socket errored unexpectedly', e);
  };

  socket.onmessage = async function(e) {
      const edata = JSON.parse(e.data);
      const message = edata['message'];
      const from = edata['from'];

      if ("disconnect" == message){
        console.log("0. disconnect", from);
        const entity_key = "player:"+from;
        delete peerConnections[from];
        remove_entity(entity_key);
        return null;
      }

      if ("sending-uuid" in message){
        myUuid = message["sending-uuid"].myUuid
        console.log("2. myUuid", myUuid)
        playerWrapper.position.x = message["sending-uuid"].x
        playerWrapper.position.y = message["sending-uuid"].y
        playerWrapper.position.z = message["sending-uuid"].z
        console.log(playerWrapper);
      }

      if ("refetch_amica" in message){
        console.log("updating amica count");
        $("#amicaTotal").html(message["refetch_amica"])
      }

      // Message Que
      if ("message_que" in message){
          for (let i = 0; i < message.message_que.length; i++){
              // console.log("receiving", message["message_que"][i])
              if(message.message_que[i].type == "playerping"){
                if(message.message_que[i].myUuid != myUuid &&
                  !(message.message_que[i].myUuid in peerConnections)){
                  const update = {
                      'entity_key': "player:"+message.message_que[i].myUuid,
                      'name': message.message_que[i].name,
                      'time': message.message_que[i].time,
                      'type': message.message_que[i].type,
                      'x': message.message_que[i].x,
                      'y': message.message_que[i].y,
                      'z': message.message_que[i].z,
                      'rx': message.message_que[i].rx,
                      'ry': message.message_que[i].ry,
                      'rz': message.message_que[i].rz,
                      'avatar': message.message_que[i].avatar,
                      'keys': {},
                  }
                  console.log("initialize player", update)
                  if (!(update.entity_key in entities)){
                    update_entity(update)
                  }
                }
              }
          }
      }

      let entity_key = "player:"+from
      // console.log(entities);
      // console.log(entity_key);
      if (!(entity_key in entities)){
        // console.log("short circuit: ", entity_key);
        return;
      }

      // socket.on("requesting-media", async data => {
      if ("requesting-media" in message){
        
        
        const data = message["requesting-media"]
        const onBehalfOf = data["onBehalfOf"]
        console.log("3.b. is requesting media:", onBehalfOf)

        const configuration = {
          offerToReceiveAudio: (use_mic == "True"),
          offerToReceiveVideo: (use_webcam == "True"),
          iceServers: [     // Information about ICE servers - Use your own!
              {
                'urls':'stun:stun.l.google.com:19302'
              },{
                'urls':'stun:stun1.l.google.com:19302'
              },{
                'urls':'stun:stun2.l.google.com:19302'
              },{
                'urls':'stun:stun3.l.google.com:19302'
              },{
                'urls':'stun:stun4.l.google.com:19302'
              }
          ]};
  
        // const peerConnection = new RTCPeerConnection(configuration)
        if (peerConnections[onBehalfOf] == undefined){
          console.log("Im in")
          peerConnections[onBehalfOf] =  {peerConnection: new RTCPeerConnection(configuration)};
        }
        let peerConnection = peerConnections[onBehalfOf].peerConnection;
        

        
        // const answer = await peerConnection.createAnswer();
        const offer = await peerConnection.createOffer({offerToReceiveAudio: (use_mic == "True"), offerToReceiveVideo: (use_webcam == "True"),});
        await peerConnection.setLocalDescription(
          new RTCSessionDescription(offer)
        );
        // await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
        console.log("4.b returning call to:", from)
        socket.send(JSON.stringify({"call-user": {
          offer: peerConnection.localDescription,
          to: from,
          onBehalfOf: myUuid
        }}));

        // socket.emit("make-answer", {
        //   answer: peerConnection.localDescription,
        //   to: data.socket
        // });
      };

      // function handleNegotiationNeededEvent(peerConnection, to_socket) {
      //   peerConnection.createOffer().then(function(offer) {
      //     return peerConnection.setLocalDescription(offer);
      //   })
      //   .then(function() {
      //     socket.send(JSON.stringify({"call-user": {
      //       offer: peerConnection.localDescription,
      //       to: to_socket
      //     }}));
      //   })
      //   .catch(function(err){
      //     console.log(err)
      //   });
      // }

      if ("call-made" in message){
        console.log("5.b call-made", from)
        let peerConnection = peerConnections[from].peerConnection;
        console.log(" Am I Here", peerConnection)

        const data = message["call-made"]
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(data.offer))
        );

        const sendChannel = peerConnection.createDataChannel("playerDataConnection");

        peerConnections[from] = {peerConnection: peerConnection, sendChannel: sendChannel, receiveChannel: undefined}


        sendChannel.onerror = (error) => {
          console.log("Data Channel Error:", error);
        };

        sendChannel.onmessage = (event) => {
          // console.log("Got Send Channel Message:", event);
          let edata = event.data;
            try{
                edata = JSON.parse(edata);
                if("type" in edata && edata.type == "Hello World!"){
                    console.log("Hellow world receiveChannel")
                }else if("type" in edata && edata.type == "playermove"){
                    // console.log("receive playermove")
                    update_entity(edata)
                }else if("type" in edata && edata.type == "removeBlock"){
                    console.log("removeBlock")
                    removeBlock(edata.x, edata.y, edata.z);
                    redrawObjects();
                }else if("type" in edata && edata.type == "drawBlock"){
                    console.log("drawBlock")
                    drawBlock(edata.x, edata.y, edata.z, edata.textureName);
                    redrawObjects();
                }
            }catch(e){
                // this is not json
                console.error("data channel error", e);
            }
        };

        sendChannel.onopen = () => {
          console.log("Data send opened")
          sendChannel.send(JSON.stringify({"type": "Hello World!"}));
        };

        sendChannel.onclose = () => {
          console.log("The Data Channel is Closed");
        };

        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
          console.log("Using legacy code");
          navigator.mediaDevices.getUserMedia = function(constraints) {

            // First get ahold of the legacy getUserMedia, if present
            var getUserMedia = navigator.GetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
              return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function(resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          }
        }

        if ((use_webcam == "True") || (use_mic == "True")){
          await navigator.mediaDevices.getUserMedia({ video: (use_webcam == "True"), audio: (use_mic == "True") })
            .then(function(stream) {
                  console.log("here", stream, stream.getTracks())
                  stream.getTracks().forEach(async track => {
                      console.log("sending tracks", track)
                      peerConnection.addTrack(track, stream)
                  })
            })
            .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
        }
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(
            new RTCSessionDescription(answer)
        );
        console.log("8.b making the answer")
        socket.send(JSON.stringify({"make-answer": {
            answer: peerConnection.localDescription,
            to: from,
            onBehalfOf: myUuid
        }}));
      }

      // if ("receiving-candidate" in message){
      //     data = message["receiving-candidate"]
      //     console.log("5.a receiving-candidate")
      //     var candidate = new RTCIceCandidate(data.candidate);
      //     // console.log(peerConnection)
      //     peerConnection.addIceCandidate(candidate,
      //         function(){console.log('success')},
      //         function(error){console.log('error',error)}
      //     )
      // }

      if ("answer-made" in message){
        console.log("9.b answer-made")
        const data = message["answer-made"]
        const onBehalfOf = data["onBehalfOf"]

        let peerConnection = peerConnections[onBehalfOf].peerConnection;

        // await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        //   .then(function(stream) {
        //         console.log("here", stream, stream.getTracks())
        //         stream.getTracks().forEach(async track => {
        //             console.log("sending tracks", track)
        //             peerConnection.addTrack(track, stream)
        //         })
        //   })
        //   .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(JSON.parse(data.answer))
        );
      }

      if ("receiving-candidate" in message){
        const data = message["receiving-candidate"]
        const onBehalfOf = data["onBehalfOf"]

        console.log("6.b receiving-candidate from:", onBehalfOf)
        let peerConnection = peerConnections[onBehalfOf].peerConnection
        let candidate = new RTCIceCandidate(JSON.parse(data.candidate));
        await peerConnection.addIceCandidate(candidate,
          function(){console.log('7.b success')},
          function(error){console.log('error',error)}
        )
      }
  };
}


