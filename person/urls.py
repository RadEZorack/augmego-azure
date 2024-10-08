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
    path('people_list/', views.people_list, name='people_list'),
    path('family_list/', views.family_list, name='family_list'),
    path('create_family/', views.create_family, name='create_family'),
    path('add_person/', views.add_person, name='add_person'),
    path('join_family/', views.join_family, name='join_family'),
    path('set_active_family/', views.set_active_family, name='set_active_family'),
]
