from django.db import models

# Create your models here.
class Cube(models.Model):
    x = models.BigIntegerField()
    y = models.BigIntegerField()
    z = models.BigIntegerField()
    texture = models.ForeignKey("texture.Texture", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return "block:{x},{y},{z}:0".format(x=self.x, y=self.y, z=self.z)
    
class Chunk(models.Model):
    """A 10x10 chunk selling for 100 points"""
    x = models.BigIntegerField()
    y = models.BigIntegerField(default=0)
    z = models.BigIntegerField()
    owner = models.ForeignKey("person.Person", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return "chunk:{x},{y},{z}".format(x=self.x, y=self.y, z=self.z)