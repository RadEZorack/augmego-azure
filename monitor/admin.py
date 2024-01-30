from django.contrib import admin
from .models import UserLogin

# Register your models here.
class UserLoginAdmin(admin.ModelAdmin):
  list_display = ("__str__", "session_start", "session_end", "total_time")

admin.site.register(UserLogin, UserLoginAdmin)