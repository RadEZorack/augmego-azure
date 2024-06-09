from django.urls import path
from . import views

app_name = 'tutorial'

urlpatterns = [
    path('list_tutorials', views.list_tutorials, name='list_tutorials'),
]