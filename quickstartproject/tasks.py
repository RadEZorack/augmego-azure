from decimal import Decimal
import json
from celery import shared_task
from monitor.models import UserLogin
from django.db.models import Q
from django.utils import timezone
from django.core.cache import cache

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from quickstartproject.middleware import server_start_time

from person.models import Person

@shared_task
def award_amica_15min():
    """Award Amica to every player who is online every 15 min.
    We know a player is online from their UserLogin status which is calculated as follows.
    1. session_end is None
    2. session_start is greater than last server start time. (Because session_end does not get updated if the server restarts)
    """
    user_ids = UserLogin.objects.filter(
        Q(session_end__isnull=True),
        Q(session_start__gt=server_start_time)
    ).values_list("user_id", flat=True)

    users = Person.objects.filter(user_id__in=user_ids)
    count = 0
    for user in users:
        count += 1
        user.amica += Decimal(1.0)
        user.save()

        # Tell the user to refetch data
        channel_layer = get_channel_layer()
        uuid = str(user.user_id)

        async_to_sync(channel_layer.group_send)(
            uuid,
            {
                'type': 'game.refetch_data',
                'from': 'server',
                'message': {'refetch_amica': str(user.amica)},
            }
        )

    return "success at awarding amica to {0} users".format(count)
