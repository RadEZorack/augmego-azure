from decimal import Decimal
from math import floor
from django.http import HttpResponse, HttpResponseForbidden
from rest_framework import serializers
import json
import time
from django.core.cache import cache

from cube.models import Chunk, Cube
from texture.models import Texture
from texture.views import TextureSerializer

class CubeSerializer(serializers.ModelSerializer):
    texture_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Cube
        fields = ('x', 'y', 'z', 'texture_name')

    def get_texture_name(self, obj):
        if obj.texture:
            return obj.texture.name
        return ""

def list_cubes(request):
    """ example: http://localhost:8000/cube/list?min_x=0&max_x=1&min_y=0&max_y=1&min_z=0&max_z=1 """
    # Define your range for each coordinate
    rg = request.GET
    # cache.clear()

    print("here 1")

    x_range = (rg.get('min_x'), rg.get('max_x'))
    y_range = (rg.get('min_y'), rg.get('max_y'))
    z_range = (rg.get('min_z'), rg.get('max_z'))

    # cubes_count = Cube.objects.filter(
    #     x__range=x_range,
    #     y__range=y_range,
    #     z__range=z_range
    # ).count()

    print("here 2")

    cache_master_key = "cubes_to_fetch:{x_range}:{y_range}:{z_range}".format(x_range=x_range,y_range=y_range,z_range=z_range).replace(" ", "_")
    cache_keys = cache.get(cache_master_key, None)
    # print(cache_keys)
    
    print("here 3")
    # Not needed
    # cache_value = []
    # if not cache_keys:
    #     print("here 3.1")
    #     for x in range(int(x_range[0]), int(x_range[1])):
    #         print("here 3.3")
    #         # Which check the cache here so that we aren't doing too large of a query
    #         cache_value += cache.get_many(cache_keys)
    #         cache_keys = []
    #         for y in range(int(y_range[0]), int(y_range[1])):
    #                 for z in range(int(z_range[0]), int(z_range[1])):
    #                     cache_keys.append("cube:{x}:{y}:{z}".format(x=x,y=y,z=z).replace(" ", "_"))
    #     print("here 3.4")
    #     cache.set(cache_master_key, list(cache_value.keys()), 60*60*24*30) # one month cache
    # else:
    print("here 4")
    if cache_keys != None:# and len(cache_value) == cubes_count:
        cache_value = cache.get_many(cache_keys)
        # print(cache_value)
        print("cache_hit")
        return HttpResponse(json.dumps(list(cache_value.values())), content_type='application/json')

    print("here 5")
    # Query using the ORM
    cubes_within_range = Cube.objects.filter(
        x__range=x_range,
        y__range=y_range,
        z__range=z_range
    )

    print("here 6")
    # cache.set(cache_master_key, list(cubes_within_range), 60*60*24*30)
    
    print("here 7")
    serializer = CubeSerializer(cubes_within_range, many=True, context={"request":request})

    print("here 8")
    cache_data = {"cube:{x}:{y}:{z}".format(x=data["x"],y=data["y"],z=data["z"]).replace(" ", "_"):data for data in serializer.data}
    # print(cache_data)
    cache.set(cache_master_key, list(cache_data.keys()), 60*60*24*30)

    print("here 9")
    cache.set_many(cache_data, 60*60*24*30) # one month cache

    print("here 10")
    data = json.dumps(serializer.data)
    return HttpResponse(data, content_type='application/json')

def post_cube(request):
    """ Create a cube via POST """
    if request.POST:
        rp = request.POST

        # Check if this user can modify the chunk
        cache_key = "chunk_get_owner:x={x},y={y},z={z}".format(
            x=floor(int(rp.get("x"))/10),
            y=0,#y=floor(int(rp.get("y"))/10),
            z=floor(int(rp.get("z"))/10))

        owner_name = cache.get(cache_key)
        if owner_name and (str(request.user.person) != owner_name):
            return HttpResponseForbidden()

        try:
            chunk = Chunk.objects.get(
                x=floor(int(rp.get("x"))/10),
                y=0,#y=floor(int(rp.get("y"))/10),
                z=floor(int(rp.get("z"))/10))
        except Chunk.DoesNotExist:
            chunk = None
            # return HttpResponseForbidden()
        
        if chunk:
            cache.set(cache_key, str(chunk.owner), None)

            if request.user.person != chunk.owner:
                return HttpResponseForbidden()

        cube, created = Cube.objects.get_or_create(x=rp.get("x"),y=rp.get("y"),z=rp.get("z"))
        if rp.get("textureName"):
            texture = Texture.objects.get(name=rp.get("textureName"))
            cube.texture = texture
            cube.save()
        elif rp.get("textureName", "") == "":
            cube.texture = None
            cube.save()

        serializer = CubeSerializer(cube, many=False, context={"request":request})

        CHUNK_SIZE = 50

        # Round to nearest 50
        x=floor(int(rp.get("x"))/CHUNK_SIZE)*CHUNK_SIZE
        y=floor(int(rp.get("y"))/CHUNK_SIZE)*CHUNK_SIZE
        z=floor(int(rp.get("z"))/CHUNK_SIZE)*CHUNK_SIZE
        x_range = (x, x + CHUNK_SIZE)
        y_range = (y, y + CHUNK_SIZE)
        z_range = (z, z + CHUNK_SIZE)

        cache_master_key = "cubes_to_fetch:{x_range}:{y_range}:{z_range}".format(x_range=x_range,y_range=y_range,z_range=z_range).replace(" ", "_")
        current_cubes = cache.get(cache_master_key, [])
        current_cube_key = "cube:{x}:{y}:{z}".format(x=serializer.data["x"],y=serializer.data["y"],z=serializer.data["z"]).replace(" ", "_")
        current_cubes.append(current_cube_key)
        current_cubes = list(set(current_cubes)) # untested

        cache.set(current_cube_key, serializer.data, 60*60*24*30) # one month cache

        cache.set(cache_master_key, current_cubes, 60*60*24*30) # one month cache


        return HttpResponse(json.dumps(serializer.data), content_type='application/json')
    
def chunk_info(request):
    """ example: http://localhost:8000/cube/chunk_info?x=0&y=0&z=0 """
    # Define your range for each coordinate
    rg = request.GET

    final_data = {}
    chunk_range = 6
    for a in range(-chunk_range,chunk_range+1):
        for b in range(0,1):# chunks no longer have height info
            for c in range(-chunk_range,chunk_range+1):
                x = int(rg.get("x"))+a
                y = 0#y = int(rg.get("y"))+b
                z = int(rg.get("z"))+c

                cache_key = "chunk_get_owner:x={x},y={y},z={z}".format(x=x,y=y,z=z)

                owner_name = cache.get(cache_key)

                if owner_name:
                    if (str(request.user.person) == owner_name):
                        # return HttpResponse("green")
                        final_data[cache_key] = "green"
                        continue
                    else:
                        # return HttpResponse("red")
                        final_data[cache_key] = "red"
                        continue
                    
                try:
                    chunk = Chunk.objects.get(x=x,y=y,z=z)
                except Chunk.DoesNotExist:
                    chunk = None

                if chunk:
                    owner_name = chunk.owner

                    if owner_name:
                        cache.set(cache_key, str(owner_name), None)
                        if (str(request.user.person) == str(owner_name)):
                            # return HttpResponse("green")
                            final_data[cache_key] = "green"
                            continue
                        else:
                            # return HttpResponse("red")
                            final_data[cache_key] = "red"
                            continue
                        
                # Fall back, can purchase
                # return HttpResponse("blue")
                final_data[cache_key] = "blue"
    
    return HttpResponse(json.dumps(final_data), content_type='application/json')

def chunk_purchase(request):
    """ example: http://localhost:8000/cube/chunk_purchase?x=0&y=0&z=0 """
    rp = request.POST
    x = int(rp.get("x"))
    y = 0#y = int(rp.get("x"))
    z = int(rp.get("z"))

    cache_key = "chunk_get_owner:x={x},y={y},z={z}".format(x=x,y=y,z=z)

    owner_name = cache.get(cache_key)

    if owner_name:
        return HttpResponseForbidden("This land is already purchased.")
    
    chunk, created = Chunk.objects.get_or_create(x=x,y=y,z=z)
    
    if request.user.person.amica < Decimal(1):
        return HttpResponseForbidden("You do not have enough Amica.")

    request.user.person.amica -= Decimal(1)
    request.user.person.save()

    chunk.owner = request.user.person
    chunk.save()

    owner_name = chunk.owner
    if owner_name:
        cache.set(cache_key, str(owner_name), None)
    return HttpResponse('')