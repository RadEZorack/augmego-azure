# chat/urls.py
from django.urls import path

from person import views

app_name = 'person'

urlpatterns = [
    path('donation-wall/', views.profile_wall, name='profile_wall'),
    path('ready_player_me/', views.ready_player_me, name='ready_player_me'),
    path('fetch-amica/', views.fetch_amica, name='fetch_amica'),
    path('change_name/', views.change_name, name='change_name'),
    path('change_password/', views.change_password, name='change_password'),
    path('change_email/', views.change_email, name='change_email'),
    path('update_avatar/', views.update_avatar, name='update_avatar'),
]
