
# from quickstartproject.tasks import create_ai
from ai.models import ArtificalIntelligence


from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Try to create an AI'

    # def add_arguments(self, parser):
    #     pass
    #     # Optional: Add command line arguments here, if you need them
    #     # e.g., parser.add_argument('sample_arg', type=int)

    def handle(self, *args, **options):
        # Your command logic goes here
        self.stdout.write('Running my create ai!')
        # create_ai.delay()
        bob = ArtificalIntelligence()
        bob.start_me()