"""quickstartproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import TemplateView

from game.views import main, ad, start
from person.views import nosignup

urlpatterns = [
    path('', main, name='main'),
    path("start/", start, name="start"),
    # path("nosignup/", nosignup, name="nosignup"),
    path('ad/', ad, name='ad'),
    path("chat/", include("chat.urls")),
    path("game/", include("game.urls")),
    path("webpage/", include("webpage.urls")),
    path("cube/", include("cube.urls")),
    path("texture/", include("texture.urls")),
    path("people/", include("person.urls")),
    path('admin/', admin.site.urls),
    # path("accounts/", include("django.contrib.auth.urls")),
    path('accounts/', include('allauth.urls')),
    # path('', TemplateView.as_view(template_name='home.html'), name='home'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
