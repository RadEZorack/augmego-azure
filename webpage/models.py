from django.db import models

# Create your models here.
class WebPage(models.Model):
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
    # url
    url = models.TextField(blank=True)
    # html
    html = models.TextField(blank=True)