from django.http import HttpResponse
from rest_framework import serializers
import json

from texture.models import Texture, TextureAtlas

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
    t = TextureAtlas.objects.first()
    return HttpResponse(json.dumps([t.image.url, t.data_json]), content_type='application/json')