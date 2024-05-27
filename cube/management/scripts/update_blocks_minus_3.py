from cube.models import Cube
from django.core.cache import cache

count = 0
total = Cube.objects.all().count()
for cube in Cube.objects.all():
    count += 1
    print(count, total)
    cube.x -= 3
    # cube.y += 3
    cube.z -= 3
    cube.save()

print("done")

cache.clear()
