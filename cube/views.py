from django.http import HttpResponse
from rest_framework import serializers
import json

from cube.models import Cube
from texture.models import Texture
from texture.views import TextureSerializer

class CubeSerializer(serializers.ModelSerializer):
    texture = TextureSerializer(many=False, read_only=True)
    
    class Meta:
        model = Cube
        fields = ('x', 'y', 'z', 'texture')

def list_cubes(request):
    """ example: http://localhost:8000/cube/list?min_x=0&max_x=1&min_y=0&max_y=1&min_z=0&max_z=1 """
    # Define your range for each coordinate
    rg = request.GET
    x_range = (rg.get('min_x'), rg.get('max_x'))
    y_range = (rg.get('min_y'), rg.get('max_y'))
    z_range = (rg.get('min_z'), rg.get('max_z'))

    # Query using the ORM
    cubes_within_range = Cube.objects.filter(
        x__range=x_range,
        y__range=y_range,
        z__range=z_range
    )

    serializer = CubeSerializer(cubes_within_range, many=True, context={"request":request})

    return HttpResponse(json.dumps(serializer.data), content_type='application/json')

def post_cube(request):
    """ Create a cube via POST """
    if request.POST:
        rp = request.POST

        cube, created = Cube.objects.get_or_create(x=rp.get("x"),y=rp.get("y"),z=rp.get("z"))
        if rp.get("textureName"):
            texture = Texture.objects.get(name=rp.get("textureName"))
            cube.texture = texture
            cube.save()
        elif rp.get("textureName", "") == "":
            cube.texture = None
            cube.save()

        serializer = CubeSerializer(cube, many=False, context={"request":request})

        return HttpResponse(json.dumps(serializer.data), content_type='application/json')