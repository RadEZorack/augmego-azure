from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import serializers
import json
from django.views.decorators.clickjacking import xframe_options_sameorigin

from tutorial.models import Tutorial

# Create your views here.
class TutorialSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Tutorial
        # fields = ('name',)
        fields = ('id', 'name', 'text', 'image_url')

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        else:
            return None

@xframe_options_sameorigin        
def list_tutorials(request):
    tutorials = Tutorial.objects.all()

    serializer = TutorialSerializer(tutorials, many=True, context={"request":request})

    # return HttpResponse(json.dumps(serializer.data), content_type='application/json')
    return render(request, "list_tutorials.html", {"tutorials": serializer.data})