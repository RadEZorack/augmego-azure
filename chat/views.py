# chat/views.py
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.shortcuts import render

@xframe_options_sameorigin
def index(request):
    return render(request, "chat/index.html")

@xframe_options_sameorigin
def room(request, room_name):
    user_name = str(request.user)

    return render(request, "chat/room.html", {"room_name": room_name, "user_name": user_name})