# chat/urls.py
from django.urls import path

from game import views

app_name = 'game'

urlpatterns = [
    path('webcam/', views.webcam, name='webcam'),
    path('<str:room_name>/', views.room, name='room'),
]
