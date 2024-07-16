from django.db import models

# Create your models here.
class Cube(models.Model):
    x = models.BigIntegerField()
    y = models.BigIntegerField()
    z = models.BigIntegerField()
    texture = models.ForeignKey("texture.Texture", on_delete=models.SET_NULL, null=True, blank=True)
    family = models.ForeignKey("person.Family", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self) -> str:
        return "block:{x},{y},{z}:0".format(x=self.x, y=self.y, z=self.z)
    
class Chunk(models.Model):
    x = models.BigIntegerField(default=0)
    y = models.BigIntegerField(default=0)
    z = models.BigIntegerField(default=0)
    x2 = models.BigIntegerField(default=0) # This value is inclusive, so if you're looping over cubes you need to add 1, ex range(x, x2 + 1)
    y2 = models.BigIntegerField(default=0)
    z2 = models.BigIntegerField(default=0)
    owner = models.ForeignKey("person.Person", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return "chunk:{x},{x2},{y},{y2},{z},{z2}".format(x=self.x, x2=self.x2, y=self.y, y2=self.y2, z=self.z, z2=self.z2)