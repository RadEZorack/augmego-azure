from django.core.management.base import BaseCommand
from cube.models import Chunk

class Command(BaseCommand):
    # python3 manage.py generate_chunks 1
    help = 'create more chunks'

    def add_arguments(self, parser):
        parser.add_argument("radius", type=int)

    def handle(self, *args, **kwargs):
        r = kwargs['radius']
        for i in range(-r, r):
            for j in range(-r, r):
                chunk, created = Chunk.objects.get_or_create(
                    x=1 + 20*i,
                    y=0,
                    z=1 + 20*j,
                    x2=19 + 20*i,
                    y2=0,
                    z2=19 + 20*j,
                )
