from django.urls import path
from . import views

app_name = 'webpage'

urlpatterns = [
    path('list', views.list_webpages, name='list'),
]