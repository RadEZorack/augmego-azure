from django.http import HttpResponse
from django.core import serializers

from webpage.models import WebPage

def list_webpages(request):
    webpages = WebPage.objects.all()

    data = serializers.serialize('json', webpages)

    return HttpResponse(data, content_type='application/json')