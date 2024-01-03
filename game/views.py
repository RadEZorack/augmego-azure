import requests
import json
import uuid

from django.shortcuts import redirect, render
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.views.decorators.csrf import csrf_exempt

from quickstartproject import settings

@xframe_options_sameorigin
def webcam(request):
    entityUuid = request.GET.get("entityUuid")
    entityName = request.GET.get("entityName")
    # This sould come from the logged in user and have permission checks, not the GET
    myUuid = request.GET.get("myUuid")
    
    return render(request, 'game/_webcam.html', {
        'entityUuid': entityUuid,
        'entityName': entityName,
        'myUuid': myUuid,
        # 'node_url': settings.NODE_URL
    })

# def room(request, room_name):
#     if request.user.is_authenticated:
#         user_name = str(request.user)
#     elif request.GET.get("name"):
#         user_name = request.GET.get("name")
#     else:
#         # url = "https://randommer.io/api/Name?nameType=fullname&quantity=1"
#         # headers={'x-api-key':'27ef3ccaa3ec4af7b8c4ef0447ec3bb7'}
#         # resp = requests.get(url, headers=headers)
#         # user_name = json.loads(resp.content)[0]
#         # user_name = uuid.uuid4()
#         user_name = ""

#     return render(request, 'game/headsUpDisplay.html', {
#         'room_name': room_name,
#         'user': request.user,
#         'user_name': user_name,
#         # 'node_url': settings.NODE_URL
#     })

# @csrf_exempt
def main(request):
    if not request.user.is_authenticated:
        return redirect("account_login")
    
    user_name = str(request.user)

    return render(request, 'game/main.html', {'user_name': user_name})