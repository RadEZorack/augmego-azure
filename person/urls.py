# chat/urls.py
from django.urls import path

from person import views

app_name = 'person'

urlpatterns = [
    path('donation-wall/', views.profile_wall, name='profile_wall'),
]
