from django.contrib import admin
from .models import Person, FamilyConnection, Family

# Register your models here.
admin.site.register(Person)
admin.site.register(FamilyConnection)
admin.site.register(Family)