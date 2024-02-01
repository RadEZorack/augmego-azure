import json
import uuid

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from monitor.models import UserLogin
from monitor.utils import hash_ip

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('---connected---')

        # Call the synchronous method in an async way
        self.user_login = await self.create_user_login(self.scope['user'])

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'room_%s' % self.room_name
        self.uuid = str(uuid.uuid4())

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
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
        await self.channel_layer.group_send(
            self.uuid,
            {
                "type": "game.sending_uuid",
                "from": self.uuid,
                'message': {"sending-uuid": {"myUuid": self.uuid}}
            },
        )

    @database_sync_to_async
    def create_user_login(self, user):
        return UserLogin.objects.create(user=user)
    
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

        # Update time stamp
        self.user_login = await self.update_user_login()

    @database_sync_to_async
    def update_user_login(self):
        return self.user_login.save()

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # if "message_que" not in text_data_json:
        #     print(text_data_json)

        if "message_que" in text_data_json:
            await self.channel_layer.group_send(
                self.room_group_name,
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
            'message': {"call-made": {"socket": event['from'], "onBehalfOf": message["call-user"]["onBehalfOf"], "offer": message["call-user"]["offer"]}}
        }));

    # Room answers video
    async def game_make_answer(self, event):
        print("forwarding a answer", event)
        message = json.loads(event['message'])
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': {"answer-made": {"socket": event['from'], "onBehalfOf": message["make-answer"]["onBehalfOf"], "answer": message["make-answer"]["answer"]}}
        }));

    # Room talks with video and vice verse
    async def game_send_candidate(self, event):
        # print("forwarding a candidate", event)
        message = json.loads(event['message'])
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'message': {"receiving-candidate": {"socket": event['from'], "onBehalfOf": message["send-candidate"]["onBehalfOf"], "candidate": message["send-candidate"]["candidate"]}}
        }));
