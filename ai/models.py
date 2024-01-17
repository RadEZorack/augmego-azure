import asyncio
import json
import websockets
import random
import math
import os
import fractions
from typing import Tuple

import cv2
import numpy
from av import VideoFrame, AudioFrame
from av.frame import Frame
from pydub import AudioSegment

AUDIO_PTIME = 0.020  # 20ms audio packetization
VIDEO_CLOCK_RATE = 90000
VIDEO_PTIME = 1 / 30  # 30fps
VIDEO_TIME_BASE = fractions.Fraction(1, VIDEO_CLOCK_RATE)

# from PIL import Image, ImageOps

try:
    import thread
except ImportError:
    import _thread as thread
import time
from aioice import Candidate

from django.utils import timezone

from aiortc import RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCConfiguration, RTCIceServer, VideoStreamTrack
from aiortc.mediastreams import AudioStreamTrack, MediaStreamError, MediaStreamTrack
from aiortc.rtcicetransport import candidate_from_aioice
from aiortc.contrib.media import MediaPlayer, PlayerStreamTrack

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "trixelme-7c0923253095.json"

class ArtificalIntelligence(object):

    def __init__(self, *args, **kwargs):
        super(ArtificalIntelligence, self).__init__(*args, **kwargs)
        self.start_time = timezone.now()
        self.current_time = timezone.now()
        self.my_name = "AI - Trixa"
        self.my_uuid = None
        self.ws = None
        self.x = 0.0
        self.y = 0.0
        self.z = 0.0
        self.rx = 0.0
        self.ry = 0.0
        self.rz = 0.0
        self.peerConnections = {}
        self.stop = False
        self.play_media = False
        self.media_player_ready = {}
        self.text_uuid = None
        self.text_uuids = ["108","11","126","138","15","152"]
        self.video_stream_track = FlagVideoStreamTrack()
        self.audio_stream_track = FlagAudioStreamTrack()

    def start_me(self):
        print("starting")
        loop = asyncio.get_event_loop()
        self.media_player = MediaPlayer("/django/ai/assets/conan_best_in_life.wav")
        try:
            asyncio.ensure_future(self.connect_to_websocket())
            asyncio.ensure_future(self.listen_to_websocket())
            asyncio.ensure_future(self.broadcast_to_websocket())
            asyncio.ensure_future(self.broadcast_to_webrtc())
            self.start_time = timezone.now()
            self.current_time = timezone.now()
            loop.run_forever()
        except KeyboardInterrupt:
            pass
        finally:
            print("closing loop")
            loop.close()

    # def create_video(self):
    #     original_image = Image.open("/django/ai/assets/person.jpg")
    #     size = (256,256)
    #     resized_image = ImageOps.fit(original_image, size, Image.ANTIALIAS)
    #     image = resized_image.convert('RGB')
    #     image.save("/django/ai/assets/person.jpg")

    async def connect_to_websocket(self):
        uri = "wss://369de4cfa06e-7199118840071997290.ngrok-free.app/ws/game/lobby/"
        async with websockets.connect(uri) as websocket:
            self.ws = websocket
            while True:
                await asyncio.sleep(1)

    async def listen_to_websocket(self):
        while True:
            await asyncio.sleep(0.01)
            if not self.ws:
                continue

            data = await self.ws.recv()
            if data:
                data = json.loads(data)
                # print(data)
                if 'message' in data:
                    message = data['message']
                    data_from = data['from']
                    if "message_que" in message:
                        continue
                    elif "sending-uuid" in message:
                        self.my_uuid = data['message']['sending-uuid']["myUuid"]

                    elif 'requesting-media' in message:
                        print("I'm getting a request for media")
                        data = message["requesting-media"]
                        onBehalfOf = data["onBehalfOf"]
                        configuration = RTCConfiguration(
                           iceServers=[
                                RTCIceServer(urls='stun:stun.l.google.com:19302'),
                                RTCIceServer(urls='stun:stun1.l.google.com:19302'),
                                RTCIceServer(urls='stun:stun2.l.google.com:19302'),
                                RTCIceServer(urls='stun:stun3.l.google.com:19302'),
                                RTCIceServer(urls='stun:stun4.l.google.com:19302'),
                            ])

                        print(configuration)

                        peerConnection = RTCPeerConnection(configuration)
                        sendChannel = peerConnection.createDataChannel("playerDataConnection")

                        self.peerConnections[onBehalfOf] = {'peerConnection': peerConnection, 'sendChannel': sendChannel, 'receiveChannel': None}


                        @sendChannel.on("error")
                        async def on_error(error):
                            print("Data send Channel Error:", error)

                        @sendChannel.on("message")
                        async def on_message(event):
                            pass
                            # print("Got Send Channel Message:", event)

                        @sendChannel.on("open")
                        async def on_open():
                            print("Data send opened")
                            sendChannel.send("Hello World!")

                        @sendChannel.on("close")
                        async def on_close():
                            print("The Data Channel is Closed")

                        print("I reach here")

                        @peerConnection.on("datachannel")
                        async def on_datachannel(event):
                            receiveChannel = event.channel;
                            peerConnections[onBehalfOf].receiveChannel = receiveChannel
                            print("got a datachannel")

                            @receiveChannel.on("error")
                            def on_error(error):
                                print("Data receive Channel Error:", error)

                            @receiveChannel.on("message")
                            def on_message(event):
                                print("Got local receive Channel Message:", event)

                            @receiveChannel.on("open")
                            def on_open():
                                print("Data recieve opened")
                                # receiveChannel.send("I have opened your data channel!")

                            @receiveChannel.on("close")
                            def on_close():
                                print("The Data Channel is Closed")

                        @peerConnection.on("icecandidate")
                        async def on_icecandiadate(event):
                            print("onicecandidate", event)
                            if event.candidate:
                                # Send the candidate to the remote peer
                                await self.ws.send(json.dumps({"send-candidate": {
                                    'candidate': event.candidate,
                                    'to': data_from,
                                    'onBehalfOf': myUuid
                                }}));
                            # else:
                                # All ICE candidates have been sent
                        @peerConnection.on("negotiationneeded")
                        async def on_negotiationneeded():
                            """ Not Tested """
                            print("renegotiating")
                            offer = peerConnection.createOffer()
                            peerConnection.setLocalDescription(offer)

                            await self.ws.send(json.dumps({"call-user": {
                                'offer': {"sdp": peerConnection.localDescription.sdp, "type": peerConnection.localDescription.type},
                                'to': data_from,
                                'onBehalfOf': self.my_uuid
                            }}));

                        # await navigator.getUserMedia(
                        #      { video: true, audio: true },
                        #      async stream => {
                        #         console.log(peerConnection, stream, stream.getTracks())
                        #        await stream.getTracks().forEach(async track => {
                        #         console.log("sending tracks", track)
                        #         await peerConnection.addTrack(track, stream)
                        #        });
                        #      },
                        #      error => {
                        #        console.warn(error.message);
                        #      }
                        #   );

                        peerConnection.addTrack(self.audio_stream_track)
                        peerConnection.addTrack(self.video_stream_track)
                        # print(self.audio_stream_track, dir(self.audio_stream_track))
                        # peerConnection.addTrack(self.media_player.audio)

                        offer = await peerConnection.createOffer();
                        await peerConnection.setLocalDescription(
                            offer
                        );
                        print("returning call", data_from)
                        await self.ws.send(json.dumps({"call-user": {
                            'offer': {"sdp": peerConnection.localDescription.sdp, "type": peerConnection.localDescription.type},
                            'to': data_from,
                            'onBehalfOf': self.my_uuid
                        }}));

                    elif "answer-made" in message:
                        data = message["answer-made"]
                        onBehalfOf = data["onBehalfOf"]
                        print("answer-made", data['answer'])
                        peerConnection = self.peerConnections[onBehalfOf]['peerConnection']
                        await peerConnection.setRemoteDescription(
                            RTCSessionDescription(sdp=data['answer']['sdp'], type=data['answer']['type'])
                        )

                        # Getting player data
                        # self.ws.send(json.dumps({"request-media": {
                        #     'to': onBehalfOf,
                        #     'onBehalfOf': self.my_uuid
                        # }}));

                    elif "call-made" in message:
                        print("call-made")
                        data = message["call-made"]
                        onBehalfOf = data["onBehalfOf"]
                        peerConnection = self.peerConnections[onBehalfOf]['peerConnection']
                        await peerConnection.setRemoteDescription(
                            RTCSessionDescription(sdp=data['offer']['sdp'], type=data['offer']['type'])
                        );
                        answer = await peerConnection.createAnswer();
                        await peerConnection.setLocalDescription(
                            answer
                        );
                        await self.ws.send(json.dumps({"make-answer": {
                          'answer': {"sdp": peerConnection.localDescription.sdp, "type": peerConnection.localDescription.type},
                          'to': onBehalfOf,
                          'onBehalfOf': self.my_uuid
                        }}));

                    elif "receiving-candidate" in message:
                        data = message["receiving-candidate"]
                        onBehalfOf = data["onBehalfOf"]
                        # print("receiving-candidate", self.peerConnections, data)
                        peerConnection = self.peerConnections[onBehalfOf]['peerConnection']
                        candidate = data['candidate']
                        candidate = Candidate.from_sdp(candidate['candidate'])
                        candidate = candidate_from_aioice(candidate)
                        candidate.sdpMid = data['candidate']['sdpMid']
                        candidate.sdpMLineIndex = data['candidate']['sdpMLineIndex']
                        await peerConnection.addIceCandidate(candidate)

    async def broadcast_to_websocket(self):
        while True:
            await asyncio.sleep(1)
            if not self.ws:
                continue

            await self.ws.send(json.dumps(
                {'message_que':
                    [{
                        'type': 'playerping',
                        'name': self.my_name,
                        'myUuid': self.my_uuid,
                        'x': self.x,
                        'y': self.y,
                        'z': self.z,
                        'rx': self.rx,
                        'ry': self.ry,
                        'rz': self.rz,
                        'time': str(timezone.now()),
                    }]
                }
            ))

    async def broadcast_to_webrtc(self):
        while True:
            delta = (timezone.now() - self.current_time).total_seconds()
            self.current_time = timezone.now()

            if self.z < -5.0:
                self.ry = 3.14
            if self.z > 5.0:
                self.ry = 0.0

                # self.text_uuid = str(int(1000*random.random()))
                # self.text_uuid = self.text_uuids.pop()
                # self.play_media = True
                # self.media_player_ready[self.text_uuid] = True
                # self.synthesize_text("Testing "+self.text_uuid, self.text_uuid)
                # self.media_player = MediaPlayer("/django/ai/assets/conan_best_in_life.wav")
                print('creating done')

            # 2 is running, 1 is walking
            self.z += - 2.0 * delta * math.cos(self.ry)

            for uuid in self.peerConnections:
                # print(os.path.exists("/django/ai/temp/"+str(self.text_uuid)+".mp3"), self.text_uuid, self.media_player_ready)
                # if self.play_media and self.media_player_ready.get(self.text_uuid) and os.path.exists("/django/ai/temp/"+self.text_uuid+".mp3"):
                # peerConnection = self.peerConnections[uuid]['peerConnection']
                # print("senders", peerConnection.getSenders())
                #     # media_player = MediaPlayer("/django/ai/temp/"+self.text_uuid+".mp3")
                #     # media_player = MediaPlayer("/django/ai/assets/conan_best_in_life.wav")
                #     media_player = MediaPlayer("/django/ai/temp/108.mp3")
                #     print("sending audio", media_player.audio)
                #     for transceiver in peerConnection.getTransceivers():
                #         print("deleteing")
                #         transceiver.stop()
                #         del transceiver

                #     peerConnection.addTrack(media_player.audio)
                #     print(peerConnection.getSenders())

                #     # offer = await peerConnection.createOffer();
                #     # await peerConnection.setLocalDescription(
                #     #     offer
                #     # );
                #     # await self.ws.send(json.dumps({"call-user": {
                #     #     'offer': {"sdp": peerConnection.localDescription.sdp, "type": peerConnection.localDescription.type},
                #     #     'to': uuid,
                #     #     'onBehalfOf': self.my_uuid
                #     # }}));
                #     self.play_media = False
                sendChannel = self.peerConnections[uuid]['sendChannel']
                # print("not ready")
                if sendChannel and sendChannel.readyState == "open":
                    # print("playermove", self.z)
                    sendChannel.send(json.dumps({
                        'type': 'playermove',
                        'name': self.my_name,
                        'entity_key': "player:"+self.my_uuid,
                        'myUuid': self.my_uuid,
                        'x': self.x,
                        'y': self.y,
                        'z': self.z,
                        'rx': self.rx,
                        'ry': self.ry,
                        'rz': self.rz,
                        'time': str(timezone.now()),
                    }))

            await asyncio.sleep(0.01)

    # def synthesize_text(self, text, text_uuid):
    #     """Synthesizes speech from the input string of text."""
    #     from google.cloud import texttospeech

    #     client = texttospeech.TextToSpeechClient()

    #     input_text = texttospeech.SynthesisInput(text=text)

    #     # Note: the voice can also be specified by name.
    #     # Names of voices can be retrieved with client.list_voices().
    #     voice = texttospeech.VoiceSelectionParams(
    #         language_code="en-US",
    #         name="en-US-Standard-C",
    #         ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
    #     )

    #     audio_config = texttospeech.AudioConfig(
    #         audio_encoding=texttospeech.AudioEncoding.MP3
    #     )

    #     response = client.synthesize_speech(
    #         request={"input": input_text, "voice": voice, "audio_config": audio_config}
    #     )

    #     # The response's audio_content is binary.
    #     with open("/django/ai/temp/"+text_uuid+".mp3", "wb") as out:
    #         out.write(response.audio_content)
    #         self.media_player_ready[text_uuid] = True
    #         print('Audio content written to file "'+text_uuid+'.mp3"')

class FlagVideoStreamTrack(VideoStreamTrack):
    """
    A video track that returns an animated flag.
    """

    def __init__(self):
        super().__init__()  # don't forget this!
        self.counter = 0
        height, width = 480, 640

        # generate flag
        data_bgr = numpy.hstack(
            [
                self._create_rectangle(
                    width=213, height=480, color=(255, 0, 0)
                ),  # blue
                self._create_rectangle(
                    width=214, height=480, color=(255, 255, 255)
                ),  # white
                self._create_rectangle(width=213, height=480, color=(0, 0, 255)),  # red
            ]
        )

        # shrink and center it
        M = numpy.float32([[0.5, 0, width / 4], [0, 0.5, height / 4]])
        data_bgr = cv2.warpAffine(data_bgr, M, (width, height))

        # compute animation
        omega = 2 * math.pi / height
        id_x = numpy.tile(numpy.array(range(width), dtype=numpy.float32), (height, 1))
        id_y = numpy.tile(
            numpy.array(range(height), dtype=numpy.float32), (width, 1)
        ).transpose()

        self.frames = []
        for k in range(30):
            phase = 2 * k * math.pi / 30
            map_x = id_x + 10 * numpy.cos(omega * id_x + phase)
            map_y = id_y + 10 * numpy.sin(omega * id_x + phase)
            self.frames.append(
                VideoFrame.from_ndarray(
                    cv2.remap(data_bgr, map_x, map_y, cv2.INTER_LINEAR), format="bgr24"
                )
            )

    async def recv(self):
        pts, time_base = await self.next_timestamp()

        frame = self.frames[self.counter % 30]
        frame.pts = pts
        frame.time_base = time_base
        self.counter += 1
        if self.counter == 1:
            print("video frame", frame)
        return frame

    def _create_rectangle(self, width, height, color):
        data_bgr = numpy.zeros((height, width, 3), numpy.uint8)
        data_bgr[:, :] = color
        return data_bgr


class FlagAudioStreamTrack(AudioStreamTrack):
    """
    A dummy audio track which reads silence.
    """

    kind = "audio"

    _start: float
    _timestamp: int

    def __init__(self):
        super().__init__()  # don't forget this!
        self.frames = []
        self.counter = 0
        # self.create_audio_frames()
        print("creating audio done")

    async def next_timestamp(self) -> Tuple[int, fractions.Fraction]:
        if self.readyState != "live":
            raise MediaStreamError

        sample_rate = 12000
        if hasattr(self, "_timestamp"):
            self._timestamp += int(AUDIO_PTIME * sample_rate)
            wait = self._start + (self._timestamp / sample_rate) - time.time()
            # print('wait',wait)
            await asyncio.sleep(wait)
        else:
            self._start = time.time()
            self._timestamp = 0
        return self._timestamp, fractions.Fraction(1, sample_rate)

    async def recv(self):
        # print("waiting")
        if self.counter >= len(self.frames):
            # We are waiting for new audio or the counter to reset
            print("creating audio frames")
            await asyncio.sleep(0.1)
            await self.create_audio_frames()
            # self._start = time.time()
            # self._timestamp = 0
            self.counter = 0

        pts, time_base = await self.next_timestamp()

        frame = self.frames[self.counter]
        frame.sample_rate = 12000
        frame.pts = pts
        frame.time_base = time_base
        self.counter += 1
        print("audio frame", frame)
        return frame

    async def create_audio_frames(self):
        print("fetching from google text to speech")
        from google.cloud import texttospeech
        print("1")

        client = texttospeech.TextToSpeechClient()

        text = str(int(1000*random.random()))

        input_text = texttospeech.SynthesisInput(text=text)

        # Note: the voice can also be specified by name.
        # Names of voices can be retrieved with client.list_voices().
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            name="en-US-Standard-C",
            ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            request={"input": input_text, "voice": voice, "audio_config": audio_config}
        )

        print("writing audio")

        # The response's audio_content is binary.
        with open("/django/ai/assets/output.mp3", "wb") as out:
            out.write(response.audio_content)
            print('Audio content written to file "number.mp3"')

        self.frames = []
        self.counter = 0
        sound = AudioSegment.from_file("/django/ai/assets/output.mp3")
        channel_sounds = sound.split_to_mono()
        channel_samples = [s.get_array_of_samples() for s in channel_sounds]
        new_samples: numpy.ndarray = numpy.array(channel_samples)
        print(new_samples)
        print(new_samples.shape)

        self.sample_rate = 24000 #sound.frame_rate # 8000
        self.sample_width = 0.02 #sound.sample_width/100 # 0.02
        self.frame_width = sound.frame_width
        print(sound.frame_rate, sound.sample_width, sound.frame_width)
        samples = int(self.sample_width * self.sample_rate) # 160
        # frame = AudioFrame(format="s16", layout="mono", samples=samples)
        # raw_samples = frame.to_ndarray()
        # print(raw_samples.ndim)
        # print(raw_samples.shape)

        for i in range(0, new_samples.shape[1], samples):
            if i+samples > new_samples.shape[1]:
                break
            raw_samples = new_samples[0][i:i+samples]
            raw_samples = raw_samples.reshape((1,samples))
            # print(raw_samples)
            # print(raw_samples.ndim)
            # print(raw_samples.shape)


            # for sample in new_samples:
            self.frames.append(
                AudioFrame.from_ndarray(raw_samples)
            )
        print(len(self.frames))
        print("starting audio")
