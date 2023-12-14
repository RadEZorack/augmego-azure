from django.urls import path
from . import views

app_name = 'texture'

urlpatterns = [
    path('list', views.list_textures, name='list'),
]