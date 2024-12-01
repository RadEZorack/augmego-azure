from django.core.management.base import BaseCommand
from django.conf import settings
from PIL import Image
import requests
from io import BytesIO
import os
import time

class Command(BaseCommand):
    help = 'Stitch 64x64 images into a 2D texture atlas'

    def handle(self, *args, **kwargs):
        # Determine if running in production
        running_in_production = settings.DEBUG is False

        if running_in_production:
            # List of image URLs from the CDN
            image_urls = [
                # "https://cdn.example.com/media/texture-image/pine-tree-leaves-texture.png",
                # Add other image URLs here...
            ]
        else:
            # Directory containing your images (local media directory)
            image_dir = os.path.join(settings.MEDIA_ROOT, 'media/texture-image')
            image_files = [f for f in os.listdir(image_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
            image_urls = [os.path.join(image_dir, f) for f in image_files]

        # Calculate the number of columns and rows
        num_images = len(image_urls)
        atlas_columns = int(num_images**0.5)
        atlas_rows = (num_images // atlas_columns) + (num_images % atlas_columns > 0)

        # Create a new blank image for the atlas
        atlas_width = atlas_columns * 64
        atlas_height = atlas_rows * 64
        atlas = Image.new('RGBA', (atlas_width, atlas_height))

        # Download or open each image and paste into the atlas
        for index, url in enumerate(image_urls):
            if running_in_production:
                success = False
                for attempt in range(5):  # Retry up to 5 times
                    try:
                        response = requests.get(url)
                        image = Image.open(BytesIO(response.content))
                        success = True
                        break
                    except requests.exceptions.RequestException as e:
                        self.stdout.write(self.style.ERROR(f'Error fetching {url}: {e}'))
                        time.sleep(2 ** attempt)  # Exponential backoff
                if not success:
                    self.stdout.write(self.style.ERROR(f'Failed to fetch {url} after multiple attempts'))
                    continue
            else:
                image = Image.open(url)

            col = index % atlas_columns
            row = index // atlas_columns
            x = col * 64
            y = row * 64
            atlas.paste(image, (x, y))

        # Save the atlas
        atlas_path = os.path.join(settings.MEDIA_ROOT, 'texture_atlas.png')
        atlas.save(atlas_path)

        self.stdout.write(self.style.SUCCESS(f'Texture atlas created at {atlas_path}'))
