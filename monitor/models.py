from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UserLogin(models.Model):
    user = user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    session_start = models.DateTimeField(auto_now_add=True)
    session_end = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return str(self.user)
    
    def total_time(self):
        return self.session_end - self.session_start