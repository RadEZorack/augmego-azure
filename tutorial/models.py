from django.db import models

# Create your models here.
class Tutorial(models.Model):
    name = models.CharField(max_length=100, default="My Tutorial")
    text = models.TextField(blank=True)
    image = models.ImageField(upload_to="media/tutorial-image/")
    order_id = models.FloatField(default=0.0)

    def __str__(self) -> str:
        return str(self.order_id) + ":" + self.name