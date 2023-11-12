from django.db import models

# Create your models here.
class Texture(models.Model):
    name = models.CharField(max_length=100, default="My Web Page", unique=True)
    image = models.ImageField(upload_to="media/texture-image/")

    def __str__(self) -> str:
        return self.name