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
from person.models import Family

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
    """ example: http://localhost:8000/cube/list?familyName=familyName&ranges=0,50,0,50,0,50_50,100,0,50,0,50 """
    # Define your range for each coordinate
    final_data = []

    rg = request.GET
    # cache.clear()

    # print("here 1")
    ranges = rg.get('ranges')
    family_name = "Lobby" #rg.get('familyName')
    ranges_split = ranges.split("_")
    # print(ranges_split)

    for range in ranges_split:
        xyz_split = range.split(",")
        # print(xyz_split)

        # Should these be ints rather than str?
        # x_range = (rg.get('min_x'), rg.get('max_x'))
        # y_range = (rg.get('min_y'), rg.get('max_y'))
        # z_range = (rg.get('min_z'), rg.get('max_z'))
        x_range = (xyz_split[0], xyz_split[1])
        y_range = (xyz_split[2], xyz_split[3])
        z_range = (xyz_split[4], xyz_split[5])

        # cubes_count = Cube.objects.filter(
        #     x__range=x_range,
        #     y__range=y_range,
        #     z__range=z_range
        # ).count()

        # print("here 2")

        cache_master_key = "cubes_to_fetch:{x_range}:{y_range}:{z_range}:{family_name}".format(x_range=x_range,y_range=y_range,z_range=z_range,family_name=family_name).replace(" ", "_")
        # print(cache_master_key)
        cache_keys = cache.get(cache_master_key, None)
        # print(cache_keys)
        
        # print("here 3")
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
        # print("here 4")
        if cache_keys != None:# and len(cache_value) == cubes_count:
            cache_value = cache.get_many(cache_keys)
            # print(cache_value)
            # print("cache_hit")
            # return HttpResponse(json.dumps(list(cache_value.values())), content_type='application/json')
            final_data += list(cache_value.values())
            continue

        # print("here 5")
        # Query using the ORM
        cubes_within_range = Cube.objects.filter(
            x__range=x_range,
            y__range=y_range,
            z__range=z_range,
            family__name=family_name
        )

        # print("here 6")
        # cache.set(cache_master_key, list(cubes_within_range), 60*60*24*30)
        
        # print("here 7")
        serializer = CubeSerializer(cubes_within_range, many=True, context={"request":request})

        # print("here 8")
        cache_data = {"cube:{x}:{y}:{z}:{family_name}".format(x=data["x"],y=data["y"],z=data["z"],family_name=family_name).replace(" ", "_"):data for data in serializer.data}
        # print(cache_data)
        cache.set(cache_master_key, list(cache_data.keys()), 60*60*24*30)

        # print("here 9")
        cache.set_many(cache_data, 60*60*24*30) # one month cache

        # print("here 10")
        # data = json.dumps(serializer.data)
        # return HttpResponse(data, content_type='application/json')
        final_data += list(serializer.data)

    # print("here 11")
    return HttpResponse(json.dumps(final_data), content_type='application/json')

def post_cube(request):
    """ Create a cube via POST """
    # if request.user.person.is_guest:
    #     return HttpResponseForbidden()

    if request.POST:
        print("im in")
        rp = request.POST

        # Check if this user can modify the chunk
        # cache_key = "chunk_get_owner:x={x},y={y},z={z}".format(
        #     x=floor(int(rp.get("x"))/10),
        #     y=0,#y=floor(int(rp.get("y"))/10),
        #     z=floor(int(rp.get("z"))/10))

        # owner_name = cache.get(cache_key)
        # if owner_name and (str(request.user.person) != owner_name):
        #     return HttpResponseForbidden()

        # try:
        #     chunk = Chunk.objects.get(
        #         x=floor(int(rp.get("x"))/10),
        #         y=0,#y=floor(int(rp.get("y"))/10),
        #         z=floor(int(rp.get("z"))/10))
        # except Chunk.DoesNotExist:
        #     chunk = None
        #     # return HttpResponseForbidden()
        
        # if chunk:
        #     cache.set(cache_key, str(chunk.owner), None)

        #     if request.user.person != chunk.owner:
        #         return HttpResponseForbidden()

        #### WE ARE NOT USING CHUNKS CURRENTLY. Instead use families
        # chunk_exists = Chunk.objects.filter(
        #     x__lte=int(rp.get("x")),
        #     x2__gte=int(rp.get("x")),
        #     # We don't use y
        #     z__lte=int(rp.get("z")),
        #     z2__gte=int(rp.get("z")),
        # ).exclude(owner=request.user.person).exclude(owner__isnull=True).exists()
        # if chunk_exists:
        #     print("chunk owner mismatch")
        #     return HttpResponseForbidden()

        family_name = "Lobby" #rg.get('familyName')
        family = Family.objects.get(name=family_name)
        cube, created = Cube.objects.get_or_create(x=rp.get("x"),y=rp.get("y"),z=rp.get("z"),family=family)
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
        x_range = (str(x), str(x + CHUNK_SIZE))
        y_range = (str(y), str(y + CHUNK_SIZE))
        z_range = (str(z), str(z + CHUNK_SIZE))

        cache_master_key = "cubes_to_fetch:{x_range}:{y_range}:{z_range}:{family_name}".format(x_range=x_range,y_range=y_range,z_range=z_range,family_name=family_name).replace(" ", "_")
        # print(cache_master_key)
        current_cubes = cache.get(cache_master_key, [])
        current_cube_key = "cube:{x}:{y}:{z}:{family_name}".format(x=serializer.data["x"],y=serializer.data["y"],z=serializer.data["z"],family_name=family_name).replace(" ", "_")
        # print(current_cube_key)
        current_cubes.append(current_cube_key)
        # print(current_cubes)
        current_cubes = list(set(current_cubes))

        cache.set(current_cube_key, serializer.data, 60*60*24*30) # one month cache

        cache.set(cache_master_key, current_cubes, 60*60*24*30) # one month cache


        return HttpResponse(json.dumps(serializer.data), content_type='application/json')
    
def chunk_info(request):
    """ example: http://localhost:8000/cube/chunk_info?x=0&y=0&z=0 """
    rg = request.GET

    x = int(rg.get("x"))
    y = 0
    z = int(rg.get("z"))

    SIZE = 50*5

    chunks = Chunk.objects.filter(x__gte=x-SIZE, x2__lte=x+SIZE, z__gte=z-SIZE, z2__lte=z+SIZE)

    final_data = {}
    for chunk in chunks:
        owner_name = chunk.owner
        key = str(chunk)

        if owner_name:
            if (str(request.user.person) == str(owner_name)):
                final_data[key] = "green"
                continue
            else:
                final_data[key] = "red"
                continue

        # Fall back, can purchase
        final_data[key] = "blue"

    return HttpResponse(json.dumps(final_data), content_type='application/json')

    return
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
    return
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