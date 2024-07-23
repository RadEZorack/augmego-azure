from django.http import HttpResponse, HttpResponseForbidden
from django import forms

from PIL import Image
from io import BytesIO
from rest_framework import serializers
import json

from texture.models import Texture, TextureAtlas
from person.models import Family

# Create your views here.
class TextureSerializer(serializers.ModelSerializer):
    # image_url = serializers.SerializerMethodField()

    class Meta:
        model = Texture
        fields = ('name',)
        # fields = ('id', 'name', 'image_url')

    # def get_image_url(self, obj):
    #     request = self.context.get('request')
    #     if obj.image and hasattr(obj.image, 'url'):
    #         return request.build_absolute_uri(obj.image.url)
    #     else:
    #         return None
        
def list_textures(request):
    return HttpResponse(json.dumps([]), content_type='application/json')
    textures = Texture.objects.all()

    serializer = TextureSerializer(textures, many=True, context={"request":request})

    return HttpResponse(json.dumps(serializer.data), content_type='application/json')

def get_texture_atlas(request):
    t = TextureAtlas.objects.filter(family__name=request.GET.get("familyName")).first()
    return HttpResponse(json.dumps([t.image.url, t.data_json]), content_type='application/json')

class TextureUploadForm(forms.Form):
    textureFile = forms.ImageField()

    def clean_image(self):
        textureFile = self.cleaned_data.get('textureFile')

        if textureFile:
            if textureFile.content_type != 'image/jpeg':
                raise forms.ValidationError('Only JPEG images are allowed.')
            
            img = Image.open(textureFile)
            if img.size != (64, 64):
                raise forms.ValidationError('Image must be 64x64 pixels.')

        return textureFile

def upload_texture(request):
    if request.user.person.is_guest:
        return HttpResponseForbidden()

    if request.method == 'POST':
        print("in one")
        title = request.POST.get("title")
        family_name = request.POST.get("familyName")
        family = Family.objects.get(name=family_name)

        

        form = TextureUploadForm(request.POST, request.FILES)
        if form.is_valid():
            texture = None
            try:
                texture = Texture.objects.create(name=title, family=family)
            except Exception as e:
                return HttpResponseForbidden("A block with this name already exists.")
            
            print("in two")
            # Save the file or handle it as needed
            textureFile = form.cleaned_data['textureFile']

            texture.image.save(title+'.jpg', textureFile, save=True)

            t = TextureAtlas.objects.get(family__name=family_name)
            t.update_atlas()

            return HttpResponse("ok")
        
    return HttpResponseForbidden("Failed to upload texture.")
