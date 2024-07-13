from decimal import Decimal
from django.db import models

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from cube.models import Chunk

User = get_user_model()

# Create your models here.
class Person(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    code = models.UUIDField(unique=True, null=True)
    # image = models.ImageField(upload_to="media/person-image/")
    amica = models.DecimalField(default=0, max_digits=15, decimal_places=3)
    is_guest = models.BooleanField(default=False)
    avatar = models.URLField(default="", blank=True, null=True)

    def __str__(self) -> str:
        if self.user:
            return str(self.user)
        return "Guest-" + str(self.code)

# Signal to create or update the user profile
@receiver(post_save, sender=User)
def create_or_update_user_person(sender, instance, created, **kwargs):
    if created:
        p = Person.objects.create(user=instance)
        # if not str(p).startswith("Guest"):
        #     instance.person.amica += Decimal(1.000)
        #     c = None
        #     r = 0
        #     while not c:
        #         r += 1
        #         for i in range(-r, r):
        #             for j in range(-r, r):
        #                 chunk, created = Chunk.objects.get_or_create(
        #                     x=1 + 40*i,
        #                     y=0,
        #                     z=1 + 40*j,
        #                     x2=39 + 40*i,
        #                     y2=0,
        #                     z2=39 + 40*j,
        #                 )
        #         c = Chunk.objects.filter(owner__isnull=True).first()
        #     c.owner = p
        #     c.save()
    instance.person.save()


class Family(models.Model):
    name = models.CharField(unique=True)
    password = models.CharField(default="", blank=True)

    def __str__(self) -> str:
        return self.name
    
class FamilyConnection(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    family = models.ForeignKey(Family, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    is_owner = models.BooleanField(default=False)

    def __str__(self) -> str:
        return str(self.family.name)+":"+str(self.person)