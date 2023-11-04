from django.db import models

# Create your models here.
class WebPage(models.Model):
    # Example
    # create3dPage(
    #     1200,
    #     1200,
    #     0.004,
    #     new THREE.Vector3(3.5, 1.5, 5),
    #     new THREE.Vector3(0, Math.PI, 0),
    #     "https://courseware.cemc.uwaterloo.ca/",
    #     ""
    # )
    # create3dPage(w, h, s, position, rotation, url, html)
    name = models.CharField(max_length=100, default="My Web Page")
    # width
    w = models.FloatField()
    # height
    h = models.FloatField()
    # scale
    s = models.FloatField()
    # position
    p1 = models.FloatField()
    p2 = models.FloatField()
    p3 = models.FloatField()
    # rotation
    r1 = models.FloatField()
    r2 = models.FloatField()
    r3 = models.FloatField()
    # image
    image = models.ImageField(upload_to="media/webpage-image/", null=True, blank=True)
    # url
    url = models.TextField(blank=True)
    # html
    html = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.name