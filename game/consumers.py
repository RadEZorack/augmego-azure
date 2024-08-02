import json
import uuid

from django.utils import timezone

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from cube.models import Chunk
from person.models import FamilyConnection
from monitor.models import UserLogin
from monitor.utils import hash_ip

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('---connected---')
        # if self.scope['user'].person.is_guest:
        #     # We don't want guests to be multiplayer
        #     return

        # Call the synchronous method in an async way
        self.user_login = await self.create_user_login(self.scope['user'])

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'room_%s' % self.room_name
        # self.uuid = str(uuid.uuid4())
        self.uuid = str(self.scope['user'].id)
        await self.list_user_families()

        print("self.family_ids", self.family_ids)

        # Join room group (global channel)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Join Family channels that are active for this user
        for fid in self.family_ids:
            await self.channel_layer.group_add(
                fid,
                self.channel_name
            )

        # Join self group
        await self.channel_layer.group_add(
            self.uuid,
            self.channel_name
        )

        await self.accept()

        # await self.send(text_data=json.dumps({
        #     'message': {"sending-uuid": {"myUuid": self.uuid}}
        # }))

        
        if hasattr(self, "chunk") and self.chunk != None:
            await self.channel_layer.group_send(
                self.uuid,
                {
                    "type": "game.sending_uuid",
                    "from": self.uuid,
                    'message': {"sending-uuid": {"myUuid": self.uuid, "avatar": self.avatar, "x": (self.chunk.x + self.chunk.x2)/2, "y": (self.chunk.y + self.chunk.y2)/2, "z": (self.chunk.z + self.chunk.z2)/2}}
                },
            )
        else:
            await self.channel_layer.group_send(
                self.uuid,
                {
                    "type": "game.sending_uuid",
                    "from": self.uuid,
                    'message': {"sending-uuid": {"myUuid": self.uuid, "avatar": self.avatar, "x": 0.0, "y": 0.0, "z": 0.0}}
                },
            )

    @database_sync_to_async
    def create_user_login(self, user):
        # if user.person.is_guest:
        #     # We don't want guests to be multiplayer
        #     self.disconnect(403)
        #     return

        self.avatar = user.person.avatar.url
        self.chunk = Chunk.objects.filter(owner=user.person).first()
        return UserLogin.objects.create(user=user)
    
    @database_sync_to_async
    def list_user_families(self):
        self.family_ids = ["family_"+str(x) for x in list(FamilyConnection.objects.filter(is_active=True, person_id=int(self.uuid)).values_list("family_id", flat=True))]
    
    async def disconnect(self, close_code):
        # Leave room group
        print('disconnected')

        # Broadcast a disconnect.
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game.disconnect",
                "from": self.uuid,
                "message": "disconnect",
            },
        )

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        for fid in self.family_ids:
            await self.channel_layer.group_discard(
                fid,
                self.channel_name
            )

        # Update time stamp
        self.user_login = await self.update_user_login()

    @database_sync_to_async
    def update_user_login(self):
        self.user_login.session_end = timezone.now()
        return self.user_login.save()

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # if "message_que" not in text_data_json:
        #     print(text_data_json)

        if "message_que" in text_data_json:
            # await self.channel_layer.group_send(
            #     self.room_group_name,
            #     {
            #         "type": "game.message_que",
            #         "from": self.uuid,
            #         "message": text_data,
            #     },
            # )
            for fid in self.family_ids:
                await self.channel_layer.group_send(
                    fid,
                    {
                        "type": "game.message_que",
                        "from": self.uuid,
                        "message": text_data,
                    },
                )

        elif "request-media" in text_data_json:
            await self.channel_layer.group_send(
                text_data_json["request-media"]["to"],
                {
                    "type": "game.request_media",
                    "from": self.uuid,
                    "message": text_data,
                },
            )

        elif "call-user" in text_data_json:
            await self.channel_layer.group_send(
                text_data_json["call-user"]["to"],
                {
                    "type": "game.call_user",
                    "from": self.uuid,
                    "message": text_data,
                },
            )

        elif "make-answer" in text_data_json:
            await self.channel_layer.group_send(
                text_data_json["make-answer"]["to"],
                {
                    "type": "game.make_answer",
                    "from": self.uuid,
                    "message": text_data,
                },
            )

        elif "send-candidate" in text_data_json:
            await self.channel_layer.group_send(
                text_data_json["send-candidate"]["to"],
                {
                    "type": "game.send_candidate",
                    "from": self.uuid,
                    "message": text_data,
                },
            )

    async def game_disconnect(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': event['message']
        }))
    
    async def game_sending_uuid(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': event['message']
        }))

    async def game_message_que(self, event):
        message = json.loads(event['message'])

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': message
        }))

    async def game_refetch_data(self, event):
        print("forwarding a refetch_data request", event)
        message = event['message']
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': {"refetch_amica": message['refetch_amica']}
        }));

    # WebRTC
    # Video requests media from room
    async def game_request_media(self, event):
        print("forwarding a request media", event)
        # TODO: make api call to see if permissions and room match
        message = json.loads(event['message'])
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': {"requesting-media": {"socket": event['from'], "onBehalfOf": message["request-media"]["onBehalfOf"]}}
        }));

    # Video calls room
    async def game_call_user(self, event):
        print("forwarding a call", event)
        message = json.loads(event['message'])
        print(message["call-user"])
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': {"call-made": {"socket": event['from'], "onBehalfOf": message["call-user"]["onBehalfOf"], "offer": json.dumps(message["call-user"]["offer"])}}
        }));

    # Room answers video
    async def game_make_answer(self, event):
        print("forwarding a answer", event)
        message = json.loads(event['message'])
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': {"answer-made": {"socket": event['from'], "onBehalfOf": message["make-answer"]["onBehalfOf"], "answer": json.dumps(message["make-answer"]["answer"])}}
        }));

    # Room talks with video and vice verse
    async def game_send_candidate(self, event):
        # print("forwarding a candidate", event)
        message = json.loads(event['message'])
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': {"receiving-candidate": {"socket": event['from'], "onBehalfOf": message["send-candidate"]["onBehalfOf"], "candidate": json.dumps(message["send-candidate"]["candidate"])}}
        }));
