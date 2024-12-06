import { peerConnections, message_que, socket } from '../main/socketConnection.js';
import { update_entity } from '../main/entity.js';
import { redrawObjects } from '../main/redrawObjects.js';
import { drawBlock } from '../main/drawBlock.js';
import { removeBlock } from '../main/removeBlock.js';

export function initWebcamPage(myUuid, entityUuid){
    console.log("4.a initWebcamPage")

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = window;
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
    if (peerConnections[entityUuid] == undefined){
        console.log("right hasjfdhhuds")
        peerConnections[entityUuid] =  {peerConnection: new RTCPeerConnection(configuration)};
    }
    let peerConnection = peerConnections[entityUuid].peerConnection;
    console.log("left", peerConnection)

    peerConnection.onicecandidate = async function(event) {
        console.log("onicecandidate", event)
      if (event.candidate) {
        // Send the candidate to the remote peer
        socket.send(JSON.stringify({"send-candidate": {
          candidate: event.candidate,
          to: entityUuid,
          onBehalfOf: myUuid
        }}));
      } else {
        console.log("All ICE candidates have been sent");
      }
    }
    // End onicecanfidate

    peerConnection.onnegotiationneeded = async function(){
        console.log("renegotiating")
        await peerConnection.createOffer({offerToReceiveAudio: (use_mic == "True"), offerToReceiveVideo: (use_webcam == "True"),}).then(function(offer) {
            return peerConnection.setLocalDescription(offer);
          })
          .then(function() {
            socket.send(JSON.stringify({"call-user": {
              offer: peerConnection.localDescription,
              to: entityUuid,
              onBehalfOf: myUuid
            }}));
          })
          .catch(function(err){
            console.log(err)
          });
    };
    // End onnegotiationneeded

    peerConnection.ondatachannel = (event) => {
        let receiveChannel = event.channel;
        console.log("received channel", receiveChannel)

        receiveChannel.onerror = (error) => {
            console.log("Data Channel Error:", error);
        };

        receiveChannel.onmessage = (event) => {
            // console.log("Got webcam receive Channel Message:", event.data);
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

        receiveChannel.onopen = () => {
            console.log("Webcam Data receive opened")
            // receiveChannel.send("Webcam opened your data channel!");
            function sendKeepAlive(){
            const keep_alive_xhr = setTimeout(function(){
                // console.log("keep alive")
                try {
                    receiveChannel.send(JSON.stringify({"keep alive": "keep alive"}))
                    
                } catch (error) {
                    console.log("receiveChannel closed")
                    return null;
                }
                sendKeepAlive()
            }, 50)
            }
            sendKeepAlive()
        };

        receiveChannel.onclose = () => {
            console.log("The Data Channel is Closed");
        };
    };
    // END ondatachannel

    peerConnection.ontrack = function(event) {
        console.log("received media", event)
        console.log("remote-video-"+entityUuid)
        let remoteVideo = document.getElementById("remote-video-"+entityUuid);
        
        console.log(remoteVideo)
        if (remoteVideo) {
            remoteVideo.srcObject = event.streams[0];
            console.log(remoteVideo, remoteVideo.srcObject)
            remoteVideo.onloadedmetadata = function(e) {
                console.log("play the video")
                remoteVideo.play();
            };
        }
    };
    // End ontrack

    

    console.log("5.a calling:", entityUuid)

    const now = new Date();

    message_que.push({
        'type': 'my_keys',
        'my_name': my_name,
        'myUuid': myUuid,
        'keys': [],
        'time': now.getTime(),
        })
    socket.send(JSON.stringify({'message_que': message_que}));
    socket.send(JSON.stringify({"request-media": {
        to: entityUuid,
        onBehalfOf: myUuid
    }}));
    
}