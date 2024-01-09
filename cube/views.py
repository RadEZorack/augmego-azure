from django.http import HttpResponse
from rest_framework import serializers
import json
import time
from django.core.cache import cache

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
    # cache.clear()

    x_range = (rg.get('min_x'), rg.get('max_x'))
    y_range = (rg.get('min_y'), rg.get('max_y'))
    z_range = (rg.get('min_z'), rg.get('max_z'))

    cubes_count = Cube.objects.filter(
        x__range=x_range,
        y__range=y_range,
        z__range=z_range
    ).count()

    cache_master_key = "cubes_to_fetch:{x_range}:{y_range}:{z_range}".format(x_range=x_range,y_range=y_range,z_range=z_range)
    cache_keys = cache.get(cache_master_key, [])
    
    
    if not cache_keys:
        for x in range(int(x_range[0]), int(x_range[1])):
            for y in range(int(y_range[0]), int(y_range[1])):
                    for z in range(int(z_range[0]), int(z_range[1])):
                        cache_keys.append("cube:{x}:{y}:{z}".format(x=x,y=y,z=z))
        
        cache_value = cache.get_many(cache_keys)
        cache.set(cache_master_key, list(cache_value.keys()), 60*60*24*30) # one month cache
    else:
        cache_value = cache.get_many(cache_keys)


    if cache_keys and len(cache_value) == cubes_count:
        return HttpResponse(json.dumps(cache_value), content_type='application/json')

    
    # Query using the ORM
    cubes_within_range = Cube.objects.filter(
        x__range=x_range,
        y__range=y_range,
        z__range=z_range
    )
    cache.set(cache_master_key, list(cubes_within_range), 60*60*24*30)
    
    serializer = CubeSerializer(cubes_within_range, many=True, context={"request":request})

    cache_data = {"cube:{x}:{y}:{z}".format(x=data["x"],y=data["y"],z=data["z"]):data for data in serializer.data}

    cache.set_many(cache_data, 60*60*24*30) # one month cache

    data = json.dumps(serializer.data)
    return HttpResponse(data, content_type='application/json')

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

        # These values are hard coded for now, wait for chunking
        x_range = (-100, 100)
        y_range = (-100, 100)
        z_range = (-100, 100)

        cache_master_key = "cubes_to_fetch:{x_range}:{y_range}:{z_range}".format(x_range=x_range,y_range=y_range,z_range=z_range)
        current_cubes = cache.get(cache_master_key)
        current_cubes += "cube:{x}:{y}:{z}".format(x=serializer.data["x"],y=serializer.data["y"],z=serializer.data["z"])
        
        cache.set(cache_master_key, list(current_cubes), 60*60*24*30) # one month cache


        return HttpResponse(json.dumps(serializer.data), content_type='application/json')