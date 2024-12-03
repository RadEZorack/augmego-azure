import requests
import json
import uuid
from PIL import Image
from io import BytesIO

from django.core.files.base import ContentFile
from django.core.files.images import ImageFile
from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import redirect, render
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.views.decorators.csrf import csrf_exempt

from openai import OpenAI

from quickstartproject import settings

from texture.models import Texture, TextureAtlas
from tutorial.models import Tutorial
from person.models import Family

from django.views.decorators.http import require_GET
import os

@require_GET
def robots_txt(request):
    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        "Sitemap: https://augmego.com/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


@xframe_options_sameorigin
def webcam(request):
    entityUuid = request.GET.get("entityUuid")
    entityName = request.GET.get("entityName")
    # This sould come from the logged in user and have permission checks, not the GET
    myUuid = request.GET.get("myUuid")
    
    return render(request, 'game/_webcam.html', {
        'entityUuid': entityUuid,
        'entityName': entityName,
        'myUuid': myUuid,
        # 'node_url': settings.NODE_URL
    })

# def room(request, room_name):
#     if request.user.is_authenticated:
#         user_name = str(request.user)
#     elif request.GET.get("name"):
#         user_name = request.GET.get("name")
#     else:
#         # url = "https://randommer.io/api/Name?nameType=fullname&quantity=1"
#         # headers={'x-api-key':'27ef3ccaa3ec4af7b8c4ef0447ec3bb7'}
#         # resp = requests.get(url, headers=headers)
#         # user_name = json.loads(resp.content)[0]
#         # user_name = uuid.uuid4()
#         user_name = ""

#     return render(request, 'game/headsUpDisplay.html', {
#         'room_name': room_name,
#         'user': request.user,
#         'user_name': user_name,
#         # 'node_url': settings.NODE_URL
#     })

# @csrf_exempt
def main(request):
    if not request.user.is_authenticated:
        return redirect("index")
    
    user_name = str(request.user.person)
    if user_name.startswith("Guest"):
        user_name = user_name[0:10]
    else:
        user_name = str(request.user.first_name)
    # user_name = uuid.uuid4()
    amica = request.user.person.amica
    avatar = ""
    if request.user.person.avatar:
        avatar = request.user.person.avatar.url

    # tutorials = Tutorial.objects.all()

    return render(request, 'game/main.html', {
            'user_name': user_name, 'amica': amica, 'avatar': avatar, 'tutorials': [],
            'use_webcam': False, 'use_mic': False
        })

@xframe_options_sameorigin
def ad(request):
    return render(request, 'ad.html', {})

@xframe_options_sameorigin
def trixie(request):
    return render(request, 'trixie.html', {})

def start(request):
    return render(request, 'account/start.html', {})

def simple(request):
    user_name = str(request.user.person)
    if user_name.startswith("Guest"):
        user_name = user_name[0:10]

    return render(request, 'game/simple.html', {'user_name': user_name})

def debug(request):
    return render(request, 'game/debug.html')

def test(request):
    return render(request, 'game/test.html')

def generate_image(request):
    # if request.user.person.is_guest:
    #     return HttpResponseForbidden()
    
    client = OpenAI()

    title = request.POST.get("title")
    description = request.POST.get("description")
    family_name = request.POST.get("familyName")
    family = Family.objects.get(name=family_name)

    texture = None
    try:
        texture = Texture.objects.create(name=title, family=family)
    except Exception as e:
        return HttpResponseForbidden("A block with this name already exists.")

    response = client.images.generate(
        model="dall-e-3",
        prompt=description,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    image_url = response.data[0].url
    # print(image_url)

    response = requests.get(image_url)
    if response.status_code == 200:
        # If the response is successful
        # Open the image and resize it
        image = Image.open(BytesIO(response.content))
        image = image.resize((64, 64))

        # Save the image data to a BytesIO object
        image_io = BytesIO()
        image.save(image_io, format='JPEG')

        # Create a Django ContentFile from the BytesIO object
        image_content = ContentFile(image_io.getvalue())

        # Create an image file and save it to the ImageField
        texture.image.save(title+'.jpg', image_content, save=True)

    t = TextureAtlas.objects.get(family__name=family_name)
    t.update_atlas()

    return HttpResponse("ok")