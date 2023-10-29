from django.db import models

# Create your models here.
class WebPage(models.Model):
    # create3dPage(w, h, s, position, rotation, url, html)
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
    url = models.CharField()
    # html
    html = models.TextField()