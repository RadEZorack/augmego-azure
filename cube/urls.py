from django.urls import path
from . import views

app_name = 'cube'

urlpatterns = [
    path('list', views.list_cubes, name='list'),
    path('post', views.post_cube, name='post'),
]