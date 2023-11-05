from django.http import HttpResponse
from rest_framework import serializers

from webpage.models import WebPage

class WebPageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = WebPage
        fields = '__all__'

def list_webpages(request):
    webpages = WebPage.objects.all()

    serializer = WebPageSerializer(webpages, many=True, context={"request":request})

    return HttpResponse(serializer.data, content_type='application/json')