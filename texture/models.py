from django.db import models
from PIL import Image
import os
import requests
from io import BytesIO
from django.core.files.base import ContentFile
from django.conf import settings
import time

# Create your models here.
class Texture(models.Model):
    name = models.CharField(max_length=100, default="My Web Page", unique=True)
    image = models.ImageField(upload_to="media/texture-image/")

    def __str__(self) -> str:
        return self.name
    
class TextureAtlas(models.Model):
    image = models.ImageField(upload_to="media/texture-atlas/")
    data_json = models.JSONField(default=[])

    def update_atlas(self):
        # Determine if running in production
        running_in_production = settings.DEBUG is False
        textures = Texture.objects.all()

        # List of image URLs from the CDN
        image_json = []
        # image_dir = os.path.join(settings.MEDIA_ROOT, 'media/texture-image')
        for t in textures:
            if running_in_production:
                # List of image URLs from the CDN
                # image_urls = [
                #     "https://cdn.example.com/media/texture-image/pine-tree-leaves-texture.png",
                #     # Add other image URLs here...
                # ]
                image_json.append({"url": settings.MEDIA_URL + t.image.url, "name": t.name, "x": 0, "y": 0})
            else:
                image_json.append({"url": settings.MEDIA_ROOT + t.image.url, "name": t.name, "x": 0, "y": 0})

        # Calculate the number of columns and rows
        num_images = len(image_json)
        atlas_columns = int(num_images**0.5)
        atlas_rows = (num_images // atlas_columns) + (num_images % atlas_columns > 0)

        # Create a new blank image for the atlas
        atlas_width = atlas_columns * 64
        atlas_height = atlas_rows * 64
        atlas = Image.new('RGBA', (atlas_width, atlas_height))

        # Download or open each image and paste into the atlas
        for index, image in enumerate(image_json):
            if running_in_production:
                success = False
                for attempt in range(5):  # Retry up to 5 times
                    try:
                        response = requests.get(image['url'])
                        image = Image.open(BytesIO(response.content))
                        success = True
                        break
                    except requests.exceptions.RequestException as e:
                        url = image['url']
                        print(f'Error fetching {url}: {e}')
                        time.sleep(2 ** attempt)  # Exponential backoff
                if not success:
                    url = image['url']
                    print(f'Failed to fetch {url} after multiple attempts')
                    continue
            else:
                image = Image.open(image['url'])

            col = index % atlas_columns
            row = index // atlas_columns
            x = col * 64
            y = row * 64
            image_json[index]['x'] = x
            image_json[index]['y'] = y
            atlas.paste(image, (x, y))

        # Save the image data to a BytesIO object
        image_io = BytesIO()
        atlas.save(image_io, format='PNG')

        # Create a Django ContentFile from the BytesIO object
        image_content = ContentFile(image_io.getvalue())

        # Create an image file and save it to the ImageField
        self.data_json = image_json
        self.image.save('texture-atlas-lobby.png', image_content, save=True)
